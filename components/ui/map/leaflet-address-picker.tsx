"use client";

import { useEffect, useId, useRef, useState } from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  OSM_ATTRIBUTION,
  OSM_MAX_ZOOM,
  OSM_TILE_URL,
} from "@/lib/map/osm";
import type { ResolvedMapAddress } from "@/lib/map/nominatim";
import {
  reverseMapPlace,
  searchMapPlaces,
} from "@/services/user/map-geocode";
import { useTranslation } from "@/hooks/use-translation";
import "leaflet/dist/leaflet.css";

export type LeafletAddressPickerProps = {
  marker: { lat: number; lng: number } | null;
  onPlaceMarker: (lat: number, lng: number) => void;
  onAddressResolved?: (address: ResolvedMapAddress) => void;
  className?: string;
  zoom?: number;
  disabled?: boolean;
};

const PRIMARY = "#0448F5";
const PRIMARY_LIGHT = "#5A9CBF";

const markerIcon = L.divIcon({
  className: "osm-pin",
  iconSize: [36, 44],
  iconAnchor: [18, 42],
  html: `
    <span class="osm-pin__wrap" aria-hidden="true">
      <svg viewBox="0 0 36 44" width="36" height="44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="osmPinShadow" x="-20%" y="-10%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="1.6" flood-color="rgba(0,0,0,.28)"/>
          </filter>
          <linearGradient id="osmPinBody" x1="18" y1="2" x2="18" y2="42" gradientUnits="userSpaceOnUse">
            <stop stop-color="${PRIMARY_LIGHT}"/>
            <stop offset="1" stop-color="${PRIMARY}"/>
          </linearGradient>
        </defs>
        <path
          filter="url(#osmPinShadow)"
          d="M18 42s14-14.2 14-24A14 14 0 1 0 4 18c0 9.8 14 24 14 24Z"
          fill="url(#osmPinBody)"
        />
        <circle cx="18" cy="17" r="7" fill="white" fill-opacity=".95"/>
        <circle cx="18" cy="17" r="3.4" fill="${PRIMARY}"/>
      </svg>
    </span>
  `,
});

function DoubleClickPlaceHandler({
  onPlaceMarker,
}: {
  onPlaceMarker: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    dblclick(event: L.LeafletMouseEvent) {
      L.DomEvent.preventDefault(event.originalEvent);
      L.DomEvent.stopPropagation(event.originalEvent);
      onPlaceMarker(event.latlng.lat, event.latlng.lng);
    },
  });
  return null;
}

function RecenterOnMarker({
  marker,
}: {
  marker: { lat: number; lng: number } | null;
}) {
  const map = useMap();
  const lastKey = useRef<string | null>(null);

  useEffect(() => {
    if (!marker) {
      lastKey.current = null;
      return;
    }

    const key = `${marker.lat.toFixed(6)},${marker.lng.toFixed(6)}`;
    if (lastKey.current === key) return;
    lastKey.current = key;

    map.setView([marker.lat, marker.lng], Math.max(map.getZoom(), 15), {
      animate: false,
    });
  }, [marker, map]);

  return null;
}

function InvalidateSizeOnce() {
  const map = useMap();

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      map.invalidateSize();
    });
    return () => cancelAnimationFrame(frame);
  }, [map]);

  return null;
}

function FlyToPosition({
  target,
}: {
  target: { lat: number; lng: number; token: number } | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!target) return;
    map.setView([target.lat, target.lng], Math.max(map.getZoom(), 16), {
      animate: true,
    });
  }, [target, map]);

  return null;
}

export function LeafletAddressPicker({
  marker,
  onPlaceMarker,
  onAddressResolved,
  className,
  zoom = DEFAULT_MAP_ZOOM,
  disabled = false,
}: LeafletAddressPickerProps) {
  const { t } = useTranslation();
  const listId = useId();
  const start = marker ?? DEFAULT_MAP_CENTER;

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ResolvedMapAddress[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [flyTarget, setFlyTarget] = useState<{
    lat: number;
    lng: number;
    token: number;
  } | null>(null);

  const resolveSeq = useRef(0);

  const resolveAddress = async (lat: number, lng: number) => {
    if (!onAddressResolved) return;

    const seq = ++resolveSeq.current;
    setIsResolving(true);
    setSearchError(null);

    try {
      const address = await reverseMapPlace(lat, lng);
      if (seq !== resolveSeq.current) return;
      onAddressResolved(address);
    } catch {
      if (seq !== resolveSeq.current) return;
      setSearchError(t("userPanel.profile.address.mapResolveFailed"));
    } finally {
      if (seq === resolveSeq.current) {
        setIsResolving(false);
      }
    }
  };

  const handlePlaceMarker = (lat: number, lng: number) => {
    onPlaceMarker(lat, lng);
    void resolveAddress(lat, lng);
  };

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    let cancelled = false;
    setIsSearching(true);
    setSearchError(null);

    const timer = window.setTimeout(() => {
      void searchMapPlaces(trimmed)
        .then((data) => {
          if (cancelled) return;
          setResults(data);
        })
        .catch(() => {
          if (cancelled) return;
          setResults([]);
          setSearchError(t("userPanel.profile.address.mapSearchFailed"));
        })
        .finally(() => {
          if (!cancelled) setIsSearching(false);
        });
    }, 450);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query, t]);

  const selectResult = (item: ResolvedMapAddress) => {
    setQuery(item.displayName);
    setResults([]);
    setFlyTarget({ lat: item.lat, lng: item.lng, token: Date.now() });
    onPlaceMarker(item.lat, item.lng);
    onAddressResolved?.(item);
  };

  return (
    <div
      className={[
        "relative",
        className,
        disabled ? "pointer-events-none opacity-50" : "",
        "[&_.osm-pin]:bg-transparent [&_.osm-pin__wrap]:block [&_.osm-pin__wrap]:drop-shadow-sm",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-disabled={disabled || undefined}
    >
      <div className="pointer-events-none absolute inset-s-3 top-3 z-1000 w-[min(100%-1.5rem,20rem)] sm:inset-s-4 sm:top-4 sm:w-[min(100%-2rem,22rem)]">
        <div className="pointer-events-auto rounded-xl border border-platform-border/70 bg-platform-white/95 shadow-[0_8px_24px_rgba(0,43,71,0.12)] backdrop-blur-sm">
          <label className="sr-only" htmlFor={listId}>
            {t("userPanel.profile.address.mapSearchLabel")}
          </label>
          <input
            id={listId}
            type="search"
            value={query}
            disabled={disabled}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("userPanel.profile.address.mapSearchPlaceholder")}
            className="w-full rounded-xl bg-transparent px-3.5 py-2.5 text-sm text-platform-black outline-none placeholder:text-platform-gray disabled:cursor-not-allowed"
            autoComplete="off"
          />

          {!disabled && query.trim().length >= 2 ? (
            <div className="max-h-52 overflow-y-auto border-t border-platform-border/60">
              {isSearching ? (
                <p className="px-3.5 py-2.5 text-xs text-platform-gray">
                  {t("common.loading.generic")}
                </p>
              ) : results.length ? (
                <ul className="py-1">
                  {results.map((item) => (
                    <li key={`${item.lat}-${item.lng}-${item.displayName}`}>
                      <button
                        type="button"
                        onClick={() => selectResult(item)}
                        className="w-full px-3.5 py-2.5 text-start text-xs leading-5 text-platform-black transition-colors hover:bg-primary-main/5 sm:text-sm"
                      >
                        {item.displayName}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-3.5 py-2.5 text-xs text-platform-gray">
                  {searchError ?? t("userPanel.profile.address.mapSearchEmpty")}
                </p>
              )}
            </div>
          ) : null}
        </div>

        {isResolving ? (
          <p className="mt-2 rounded-lg bg-platform-white/90 px-3 py-1.5 text-[11px] font-semibold text-primary-main shadow-sm">
            {t("userPanel.profile.address.mapResolving")}
          </p>
        ) : null}
        {searchError && query.trim().length < 2 ? (
          <p className="mt-2 rounded-lg bg-platform-white/90 px-3 py-1.5 text-[11px] font-semibold text-[#C62828] shadow-sm">
            {searchError}
          </p>
        ) : null}
      </div>

      <MapContainer
        center={[start.lat, start.lng]}
        zoom={zoom}
        scrollWheelZoom={!disabled}
        doubleClickZoom={false}
        dragging={!disabled}
        className="h-full w-full rounded-xl"
        attributionControl
        maxZoom={OSM_MAX_ZOOM}
      >
        <TileLayer
          url={OSM_TILE_URL}
          attribution={OSM_ATTRIBUTION}
          maxZoom={OSM_MAX_ZOOM}
        />
        <InvalidateSizeOnce />
        <FlyToPosition target={flyTarget} />
        {!disabled ? (
          <DoubleClickPlaceHandler onPlaceMarker={handlePlaceMarker} />
        ) : null}
        <RecenterOnMarker marker={marker} />
        {marker ? (
          <Marker
            position={[marker.lat, marker.lng]}
            icon={markerIcon}
            interactive={false}
            keyboard={false}
          />
        ) : null}
      </MapContainer>
    </div>
  );
}

/** @deprecated Use LeafletAddressPicker */
export const NeshanAddressPicker = LeafletAddressPicker;
