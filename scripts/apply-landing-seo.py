# -*- coding: utf-8 -*-
"""Apply SEO-tuned copy to the first four landing sections + meta."""

from __future__ import annotations

import json
from copy import deepcopy
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LOCALES = ROOT / "locales"

SEO = {
    "fa": {
        "meta": {
            "title": "سپهر مهوان | مهندس فول‌استک محصول — TypeScript، Next.js، React",
            "description": (
                "سپهر مهوان، مهندس فول‌استک محصول در تهران. طراحی و توسعه پلتفرم وب با "
                "TypeScript، Next.js، React و Node.js — از کشف ایده تا تحویل داشبورد، "
                "CRM و ابزار ادمین در پروداکشن."
            ),
            "keywords": (
                "سپهر مهوان، مهندس فول‌استک، توسعه‌دهنده Next.js، React، TypeScript، "
                "مهندس محصول، طراحی پلتفرم، داشبورد، CRM، تهران"
            ),
        },
        "hero": {
            "greeting": "سلام",
            "name": "من مهوانم",
            "role": "مهندس فول‌استک محصول · TypeScript",
            "body": (
                "طراحی و توسعه نرم‌افزار محصول‌محور با TypeScript، Next.js و React. "
                "از ایده تا پلتفرم قابل‌تحویل کنار تیم‌های محصول هستم — معماری، API، "
                "رابط کاربری و استقرار پروداکشن."
            ),
        },
        "skills": {
            "eyebrow": "۰۲ · کشف",
            "title": "کشف محصول قبل از کدنویسی",
            "body": (
                "قبل از اولین کامپوننت React، بریف محصول را با سؤال‌های درست تیز می‌کنم "
                "تا دامنه، کاربر و کوچک‌ترین برش قابل‌تحویل روشن شود — پلن ساخت، نه لیست آرزو."
            ),
            "listenLabel": "دارم می‌پرسم از",
            "folderLabel": "ماهوان",
            "folderItems": [
                {
                    "title": "سپهر مهوان",
                    "description": (
                        "مهندس فول‌استک محصول؛ معماری نرم‌افزار، UI و جزئیات تایپ‌سیف "
                        "از دیتابیس تا کلاینت."
                    ),
                },
                {
                    "title": "کشف محصول",
                    "description": (
                        "ایده را فشار می‌دهم تا بریف برای توسعه Next.js و React آمادهٔ تحویل شود."
                    ),
                },
                {
                    "title": "استک TypeScript",
                    "description": (
                        "React، Next.js، Node.js، PostgreSQL — فول‌استک از اسکیما تا آخرین دکمه."
                    ),
                },
                {
                    "title": "کار پلتفرمی",
                    "image": "/images/carousel/platform-analytics.jpg",
                    "alt": "داشبورد تحلیلی پلتفرم وب ساخته‌شده توسط سپهر مهوان",
                },
                {
                    "title": "آمادهٔ شپ",
                    "description": "داشبورد، CRM و پنل ادمین — لایو، قابل‌اندازه‌گیری و آمادهٔ رشد.",
                },
                {
                    "title": "آزاد برای پروژه",
                    "description": (
                        "همراه تیم‌های محصول برای تبدیل ایده به نرم‌افزار فول‌استک قابل‌استقرار."
                    ),
                },
            ],
            "facets": [
                {
                    "label": "مسئلهٔ کسب‌وکار",
                    "detail": "چه تغییری محصول را برنده می‌کند — و اگر نشود چه هزینه‌ای دارد.",
                },
                {
                    "label": "کاربر و ذی‌نفع",
                    "detail": "چه کسی استفاده می‌کند، چه کسی می‌پردازد، و چه کسی می‌تواند پروژه را متوقف کند.",
                },
                {
                    "label": "محدودیت واقعی",
                    "detail": "زمان، استک TypeScript، ظرفیت تیم و سیستم‌های فعلی پروداکشن.",
                },
                {
                    "label": "برش MVP",
                    "detail": "کوچک‌ترین نسخهٔ قابل‌تحویل که ارزش ایده را قبل از ساخت کامل ثابت می‌کند.",
                },
            ],
        },
        "softSkills": {
            "ariaLabel": "ساخت پلتفرم با مهارت‌های فنی فول‌استک",
            "eyebrow": "۰۳ · ساخت",
            "title": "ساخت پلتفرم با TypeScript و Next.js",
            "typeLines": [
                "ایده را به پلتفرم وب قابل‌تحویل تبدیل می‌کنم.",
                "TypeScript از PostgreSQL تا آخرین دکمهٔ React.",
                "سریع برای استفاده. تمیز برای توسعهٔ بعدی.",
            ],
            "processLabel": "در حال ترجمهٔ بریف به معماری",
            "doneLabel": "پلن تحویل فنی آماده شد",
            "steps": [
                "مدل‌سازی دامنه و نقش‌های کاربر",
                "طراحی API تایپ‌سیف و قرارداد دیتا",
                "انتخاب کوچک‌ترین برش قابل‌شپ",
                "ابزاربندی مانیتورینگ و کیفیت",
            ],
            "focus": ["معماری محصول", "API تایپ‌سیف", "دیزاین‌سیستم", "تحویل هفتگی"],
            "stepper": {
                "ariaLabel": "مراحل فنی ساخت محصول فول‌استک",
                "eyebrow": "پایپ‌لاین ساخت",
                "stages": [
                    {
                        "index": "۰۱",
                        "title": "اسکیما",
                        "detail": "جداول PostgreSQL، روابط، ایندکس و مایگریشن.",
                    },
                    {
                        "index": "۰۲",
                        "title": "API",
                        "detail": "روت‌های Node.js تایپ‌شده، احراز هویت و اعتبارسنجی.",
                    },
                    {
                        "index": "۰۳",
                        "title": "قراردادها",
                        "detail": "تایپ‌های مشترک TypeScript از دیتابیس تا کلاینت.",
                    },
                    {
                        "index": "۰۴",
                        "title": "UI",
                        "detail": "صفحات Next.js/React، فرم و کامپوننت دیزاین‌سیستم.",
                    },
                    {
                        "index": "۰۵",
                        "title": "دیپلوی",
                        "detail": "Docker، CI/CD، مانیتورینگ و رول‌اوت امن.",
                    },
                ],
            },
            "defaultSelected": 0,
            "stack": [
                "TypeScript",
                "React",
                "Next.js",
                "Node.js",
                "PostgreSQL",
                "Tailwind",
                "Docker",
                "Zustand",
            ],
        },
        "experience": {
            "galleryLabel": "نمونه‌کارهای پلتفرمی فول‌استک",
            "eyebrow": "۰۴ · تحویل",
            "title": "تحویل پلتفرم در پروداکشن",
            "typeLines": [
                "پلتفرم وب در دست کاربرهای واقعی است.",
                "داشبورد، CRM و ابزار ادمین — لایو و قابل‌استفاده.",
                "اندازه‌گیری‌شده، مستند، آمادهٔ مقیاس.",
            ],
            "focus": ["آمادهٔ پروداکشن", "قابل‌مانیتور", "تحویل مستند"],
            "status": "مستقر روی پروداکشن",
            "gallery": [
                {
                    "title": "داشبورد تحلیلی",
                    "image": "/images/carousel/platform-analytics.jpg",
                    "alt": "داشبورد KPI و نمودار درآمد در پلتفرم وب فول‌استک",
                },
                {
                    "title": "پایپ‌لاین CRM فروش",
                    "image": "/images/carousel/platform-crm.jpg",
                    "alt": "بورد پایپ‌لاین فروش CRM با کارت معامله و مبلغ",
                },
                {
                    "title": "گزارش‌های مالی",
                    "image": "/images/carousel/platform-reports.jpg",
                    "alt": "جدول فاکتور و وضعیت پرداخت در کنسول مالی وب",
                },
                {
                    "title": "اوپراتینگ پلتفرم",
                    "image": "/images/carousel/platform-ops.jpg",
                    "alt": "مانیتور وضعیت سرویس، آپ‌تایم و اینسیدنت پلتفرم",
                },
                {
                    "title": "ورک‌اسپیس پروژه",
                    "image": "/images/carousel/platform-project.jpg",
                    "alt": "لیست ایشو با وضعیت، اولویت و مسئول در ورک‌اسپیس تحویل",
                },
                {
                    "title": "موفقیت مشتری",
                    "image": "/images/carousel/platform-customers.jpg",
                    "alt": "داشبورد ریتنشن و فانل آنبوردینگ موفقیت مشتری",
                },
            ],
        },
    },
    "en": {
        "meta": {
            "title": "Sepehr Mahvan | Full-Stack Product Engineer — TypeScript, Next.js, React",
            "description": (
                "Sepehr Mahvan is a full-stack product engineer. I design and build web "
                "platforms with TypeScript, Next.js, React, and Node.js — from product "
                "discovery to shipping dashboards, CRMs, and admin tools in production."
            ),
            "keywords": (
                "Sepehr Mahvan, full-stack engineer, Next.js developer, React, TypeScript, "
                "product engineer, web platform, dashboard, CRM, Tehran"
            ),
        },
        "hero": {
            "greeting": "Hello",
            "name": "I'm MAHVAN",
            "role": "Full-stack Product Engineer · TypeScript",
            "body": (
                "I design and build product software with TypeScript, Next.js, and React. "
                "From idea to a shippable platform — architecture, APIs, UI, and production "
                "deploy — partnering with product teams end to end."
            ),
        },
        "skills": {
            "eyebrow": "02 · Discover",
            "title": "Product discovery before code",
            "body": (
                "Before the first React component, I sharpen the product brief with the right "
                "questions — so domain, users, and the smallest shippable slice are clear. "
                "A build plan, not a wish list."
            ),
            "listenLabel": "I'm asking about",
            "folderLabel": "Mahvan",
            "folderItems": [
                {
                    "title": "Sepehr Mahvan",
                    "description": (
                        "Full-stack product engineer — software architecture, UI, and "
                        "type-safe details from database to client."
                    ),
                },
                {
                    "title": "Discover first",
                    "description": (
                        "I pressure-test the idea until the brief is ready for Next.js and React delivery."
                    ),
                },
                {
                    "title": "TypeScript stack",
                    "description": (
                        "React, Next.js, Node.js, PostgreSQL — full-stack from schema to the last button."
                    ),
                },
                {
                    "title": "Platform work",
                    "image": "/images/carousel/platform-analytics.jpg",
                    "alt": "Analytics dashboard from a web platform built by Sepehr Mahvan",
                },
                {
                    "title": "Ship ready",
                    "description": "Dashboards, CRMs, and admin panels — live, measurable, ready to grow.",
                },
                {
                    "title": "Open for work",
                    "description": (
                        "Partnering with product teams to turn ideas into production-ready full-stack software."
                    ),
                },
            ],
            "facets": [
                {
                    "label": "The business problem",
                    "detail": "What has to change for the product to win — and the cost if it does not.",
                },
                {
                    "label": "Users & stakeholders",
                    "detail": "Who uses it, who pays, and who can stop the project.",
                },
                {
                    "label": "Real constraints",
                    "detail": "Time, TypeScript stack, team capacity, and systems already in production.",
                },
                {
                    "label": "MVP slice",
                    "detail": "The smallest shippable cut that proves the idea before a full build.",
                },
            ],
        },
        "softSkills": {
            "ariaLabel": "Building platforms with full-stack engineering skills",
            "eyebrow": "03 · Build",
            "title": "Build platforms with TypeScript & Next.js",
            "typeLines": [
                "I turn your idea into a shippable web platform.",
                "TypeScript from PostgreSQL to the last React button.",
                "Fast enough to use. Clean enough to extend.",
            ],
            "processLabel": "Translating the brief into architecture",
            "doneLabel": "Technical delivery plan ready",
            "steps": [
                "Model the domain and user roles",
                "Design type-safe APIs and data contracts",
                "Pick the smallest useful slice to ship",
                "Instrument monitoring and quality checks",
            ],
            "focus": ["Product architecture", "Type-safe APIs", "Design systems", "Weekly delivery"],
            "stepper": {
                "ariaLabel": "Technical stages of building a full-stack product",
                "eyebrow": "Build pipeline",
                "stages": [
                    {
                        "index": "01",
                        "title": "Schema",
                        "detail": "PostgreSQL tables, relations, indexes, and migrations.",
                    },
                    {
                        "index": "02",
                        "title": "API",
                        "detail": "Typed Node.js routes, auth, validation, and errors.",
                    },
                    {
                        "index": "03",
                        "title": "Contracts",
                        "detail": "Shared TypeScript types from database to client.",
                    },
                    {
                        "index": "04",
                        "title": "UI",
                        "detail": "Next.js/React screens, forms, and design-system components.",
                    },
                    {
                        "index": "05",
                        "title": "Deploy",
                        "detail": "Docker, CI/CD, monitoring, and a safe rollout.",
                    },
                ],
            },
            "defaultSelected": 0,
            "stack": [
                "TypeScript",
                "React",
                "Next.js",
                "Node.js",
                "PostgreSQL",
                "Tailwind",
                "Docker",
                "Zustand",
            ],
        },
        "experience": {
            "galleryLabel": "Selected full-stack platform work",
            "eyebrow": "04 · Ship",
            "title": "Ship platforms to production",
            "typeLines": [
                "Your web platform is in real users' hands.",
                "Dashboards, CRMs, admin tools — live and usable.",
                "Measured, documented, ready to scale.",
            ],
            "focus": ["Production-ready", "Observable", "Documented handoff"],
            "status": "Deployed to production",
            "gallery": [
                {
                    "title": "Analytics dashboard",
                    "image": "/images/carousel/platform-analytics.jpg",
                    "alt": "KPI tiles and revenue chart on a full-stack web analytics dashboard",
                },
                {
                    "title": "Sales CRM pipeline",
                    "image": "/images/carousel/platform-crm.jpg",
                    "alt": "Sales CRM pipeline board with deal cards and amounts",
                },
                {
                    "title": "Finance & billing",
                    "image": "/images/carousel/platform-reports.jpg",
                    "alt": "Invoice table and payment status on a finance web console",
                },
                {
                    "title": "Platform operations",
                    "image": "/images/carousel/platform-ops.jpg",
                    "alt": "Service status grid with uptime and incident timeline",
                },
                {
                    "title": "Project workspace",
                    "image": "/images/carousel/platform-project.jpg",
                    "alt": "Issue list with status, priority, and assignees in a delivery workspace",
                },
                {
                    "title": "Customer success",
                    "image": "/images/carousel/platform-customers.jpg",
                    "alt": "Retention heatmap and onboarding funnel on a customer-success dashboard",
                },
            ],
        },
    },
}

OTHER = {
    "ar": {
        "meta": {
            "title": "سبهر مهوان | مهندس منتجات فول ستاك — TypeScript و Next.js و React",
            "description": (
                "سبهر مهوان مهندس منتجات فول ستاك. أصمم وأبني منصات ويب بـ TypeScript و "
                "Next.js و React و Node.js — من اكتشاف المنتج حتى تسليم لوحات التحكم "
                "وCRM وأدوات الإدارة في الإنتاج."
            ),
            "keywords": (
                "سبهر مهوان، مهندس فول ستاك، مطور Next.js، React، TypeScript، "
                "مهندس منتج، منصة ويب، لوحة تحكم، CRM"
            ),
        },
        "hero": {
            "greeting": "مرحباً",
            "name": "أنا مهوان",
            "role": "مهندس منتجات فول ستاك · TypeScript",
            "body": (
                "أصمم وأبني برمجيات المنتجات بـ TypeScript و Next.js و React. من الفكرة "
                "إلى منصة قابلة للتسليم — البنية، واجهات API، الواجهة، والنشر للإنتاج مع فرق المنتج."
            ),
        },
        "skills_title": "اكتشاف المنتج قبل البرمجة",
        "skills_body": (
            "قبل أول مكوّن React أصقل موجز المنتج بالأسئلة الصحيحة حتى يتضح النطاق "
            "والمستخدم وأصغر شريحة قابلة للتسليم — خطة بناء لا قائمة أمنيات."
        ),
        "soft_title": "بناء المنصات بـ TypeScript و Next.js",
        "exp_title": "تسليم المنصات إلى الإنتاج",
    },
    "de": {
        "meta": {
            "title": "Sepehr Mahvan | Full-Stack Product Engineer — TypeScript, Next.js, React",
            "description": (
                "Sepehr Mahvan ist Full-Stack Product Engineer. Ich entwerfe und baue "
                "Webplattformen mit TypeScript, Next.js, React und Node.js — von der "
                "Product Discovery bis zu Dashboards, CRMs und Admin-Tools in Production."
            ),
            "keywords": (
                "Sepehr Mahvan, Full-Stack Engineer, Next.js Entwickler, React, TypeScript, "
                "Product Engineer, Webplattform, Dashboard, CRM"
            ),
        },
        "hero": {
            "greeting": "Hallo",
            "name": "Ich bin Mahvan",
            "role": "Full-Stack Product Engineer · TypeScript",
            "body": (
                "Ich entwerfe und baue Produktsoftware mit TypeScript, Next.js und React. "
                "Von der Idee zur lieferbaren Plattform — Architektur, APIs, UI und "
                "Production-Deploy mit Product-Teams."
            ),
        },
        "skills_title": "Product Discovery vor dem Code",
        "skills_body": (
            "Vor der ersten React-Komponente schärfe ich das Product Brief mit den richtigen "
            "Fragen — Domain, Nutzer und kleinster lieferbarer Slice klar. Ein Build-Plan, "
            "keine Wunschliste."
        ),
        "soft_title": "Plattformen mit TypeScript & Next.js bauen",
        "exp_title": "Plattformen in Production shippen",
    },
    "ja": {
        "meta": {
            "title": "Sepehr Mahvan | フルスタックプロダクトエンジニア — TypeScript / Next.js / React",
            "description": (
                "Sepehr Mahvanはフルスタックのプロダクトエンジニアです。TypeScript・Next.js・"
                "React・Node.jsでWebプラットフォームを設計・開発。プロダクト探索からダッシュボード、"
                "CRM、管理ツールの本番納品まで。"
            ),
            "keywords": (
                "Sepehr Mahvan, フルスタックエンジニア, Next.js, React, TypeScript, "
                "プロダクトエンジニア, Webプラットフォーム, ダッシュボード, CRM"
            ),
        },
        "hero": {
            "greeting": "こんにちは",
            "name": "Mahvanです",
            "role": "フルスタックプロダクトエンジニア · TypeScript",
            "body": (
                "TypeScript・Next.js・Reactでプロダクトソフトウェアを設計・開発します。"
                "アイデアから出荷可能なプラットフォームまで — アーキテクチャ、API、UI、"
                "本番デプロイをプロダクトチームと推進します。"
            ),
        },
        "skills_title": "実装前のプロダクト探索",
        "skills_body": (
            "最初のReactコンポーネントの前に、正しい問い打でブリーフを研ぎ、ドメイン・"
            "ユーザー・最小の出荷単位を明確にします。ウィッシュリストではなくビルド計画です。"
        ),
        "soft_title": "TypeScriptとNext.jsでプラットフォームを構築",
        "exp_title": "プラットフォームを本番へ出荷",
    },
    "ru": {
        "meta": {
            "title": "Sepehr Mahvan | Full-Stack Product Engineer — TypeScript, Next.js, React",
            "description": (
                "Sepehr Mahvan — full-stack product engineer. Проектирую и создаю "
                "веб-платформы на TypeScript, Next.js, React и Node.js — от discovery "
                "до дашбордов, CRM и админ-инструментов в production."
            ),
            "keywords": (
                "Sepehr Mahvan, full-stack инженер, Next.js, React, TypeScript, "
                "product engineer, веб-платформа, дашборд, CRM"
            ),
        },
        "hero": {
            "greeting": "Привет",
            "name": "Я Mahvan",
            "role": "Full-stack Product Engineer · TypeScript",
            "body": (
                "Проектирую и разрабатываю продуктовый софт на TypeScript, Next.js и React. "
                "От идеи до поставляемой платформы — архитектура, API, UI и production-деплой "
                "вместе с product-командами."
            ),
        },
        "skills_title": "Product discovery до кода",
        "skills_body": (
            "До первого React-компонента уточняю бриф правильными вопросами — домен, "
            "пользователи и минимальный shippable slice. План сборки, не wish list."
        ),
        "soft_title": "Сборка платформ на TypeScript и Next.js",
        "exp_title": "Поставка платформ в production",
    },
    "zh": {
        "meta": {
            "title": "Sepehr Mahvan｜全栈产品工程师 — TypeScript、Next.js、React",
            "description": (
                "Sepehr Mahvan，全栈产品工程师。使用 TypeScript、Next.js、React 与 Node.js "
                "设计并构建 Web 平台——从产品发现到仪表盘、CRM 与管理后台的生产交付。"
            ),
            "keywords": (
                "Sepehr Mahvan, 全栈工程师, Next.js, React, TypeScript, "
                "产品工程师, Web平台, 仪表盘, CRM"
            ),
        },
        "hero": {
            "greeting": "你好",
            "name": "我是 Mahvan",
            "role": "全栈产品工程师 · TypeScript",
            "body": (
                "用 TypeScript、Next.js 与 React 设计并构建产品软件。从想法到可交付平台——"
                "架构、API、界面与生产部署，与产品团队端到端合作。"
            ),
        },
        "skills_title": "编码前的产品发现",
        "skills_body": (
            "在第一个 React 组件之前，用正确的问题打磨产品简报，明确领域、用户与最小可交付切片——"
            "是构建计划，不是愿望清单。"
        ),
        "soft_title": "用 TypeScript 与 Next.js 构建平台",
        "exp_title": "将平台交付到生产环境",
    },
}


def apply_other(data: dict, overrides: dict) -> dict:
    en = SEO["en"]
    data["meta"] = overrides["meta"]
    data["hero"] = overrides["hero"]
    skills = deepcopy(en["skills"])
    skills["title"] = overrides["skills_title"]
    skills["body"] = overrides["skills_body"]
    data["skills"] = skills
    soft = deepcopy(en["softSkills"])
    soft["title"] = overrides["soft_title"]
    data["softSkills"] = soft
    exp = deepcopy(en["experience"])
    exp["title"] = overrides["exp_title"]
    data["experience"] = exp
    return data


def main() -> None:
    for path in sorted(LOCALES.glob("*/landing.json")):
        lang = path.parent.name
        data = json.loads(path.read_text(encoding="utf-8"))
        if lang in SEO:
            block = SEO[lang]
            data["meta"] = block["meta"]
            data["hero"] = block["hero"]
            data["skills"] = block["skills"]
            data["softSkills"] = block["softSkills"]
            data["experience"] = block["experience"]
        else:
            data = apply_other(data, OTHER[lang])
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"ok {lang}")


if __name__ == "__main__":
    main()
