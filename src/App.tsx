import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import L from "leaflet";
import logoImage from "../img/akmal-logo.svg";
import {
  ArrowUpRight,
  ChevronDown,
  Clock,
  Cross,
  FlaskConical,
  Globe,
  Instagram,
  MapPin,
  Moon,
  Phone,
  Search,
  Send,
  ShoppingCart,
  Sun,
} from "lucide-react";

type LangCode = "ru" | "uz" | "en";
type BranchType = "Apteka 24/7" | "Apteka";

type Branch = {
  name: string;
  address: string;
  hours: string;
  phone: string;
  type: BranchType;
  coords: [number, number];
};

const ALL_BRANCHES: Branch[] = [
  { name: '№1 "1 МИКР"', address: 'Андижон шаҳар, А.Фуркат кучаси 24-уй (микрорайон Конечка)', hours: 'Круглосуточно', phone: '(91) 488-88-00', type: 'Apteka 24/7', coords: [40.7836, 72.331] },
  { name: '№2 "MR"', address: 'Андижон шаҳар, Бобур шоҳ кучаси 37-уй (Янги бозор "Мумтоз" атрофи)', hours: 'Круглосуточно', phone: '(90) 380-88-00', type: 'Apteka 24/7', coords: [40.7901, 72.3521] },
  { name: '№2 "MR косметика"', address: 'Андижон шаҳар, Бобур шоҳ кучаси 37-уй', hours: '08:00-22:00', phone: '(91) 486-88-00', type: 'Apteka', coords: [40.7901, 72.3521] },
  { name: '№3 "ЭСКИ-ШАХАР"', address: 'Андижон шаҳар, Бозор кучаси 2-уй', hours: 'Круглосуточно', phone: '(91) 489-88-00', type: 'Apteka 24/7', coords: [40.7764, 72.3389] },
  { name: '№4 "ГИШТХОНА"', address: 'Андижон шаҳар, Миллий Тикланиш 77-уй', hours: '08:00-22:00', phone: '(91) 290-88-00', type: 'Apteka', coords: [40.782, 72.347] },
  { name: '№5 "ХАМКОР"', address: 'Андижон шаҳар, Бобур шоҳ кучаси 64-уй', hours: '08:00-22:00', phone: '(90) 526-88-00', type: 'Apteka', coords: [40.7881, 72.3498] },
  { name: '№6 "ГУЛШАН"', address: 'Андижон тумани, Дўстлик МФЙ, Дўстлик кўчаси 470-уй', hours: '08:00-22:00', phone: '(77) 756-88-00', type: 'Apteka', coords: [40.758, 72.328] },
  { name: '№7 "СОЙ"', address: 'Андижон шаҳар, Чулпон кучаси 50/7-уй', hours: 'Круглосуточно', phone: '(91) 479-88-00', type: 'Apteka 24/7', coords: [40.7793, 72.335] },
  { name: '№8 "ХОРТУМ"', address: 'Андижон тумани, Гузар МФЙ, Гузар кўчаси 726-уй', hours: '08:00-22:00', phone: '(93) 330-88-00', type: 'Apteka', coords: [40.762, 72.318] },
  { name: '№9 "БОГИШАМОЛ"', address: 'Андижон тумани, Хортум қишлоғи, Жаҳонобод маҳалласи', hours: 'Круглосуточно', phone: '(91) 496-88-00', type: 'Apteka 24/7', coords: [40.754, 72.312] },
  { name: '№10 "АЙРИЛИШ"', address: 'Андижон тумани, Иттифоқ МФЙ, Ҳовузбўйи кўчаси 83А', hours: '08:00-22:00', phone: '(95) 247-88-00', type: 'Apteka', coords: [40.768, 72.323] },
  { name: '№11 "КУРГОН-ТЕПА"', address: 'Қўрғонтепа тумани, Андижон кучаси 50', hours: '08:00-22:00', phone: '(99) 127-88-00', type: 'Apteka', coords: [40.689, 72.315] },
  { name: '№12 "КУЛ"', address: 'Андижон тумани, Чорбоғ МФЙ, Ал-Бухорий кўчаси 35а-уй', hours: 'Круглосуточно', phone: '(95) 267-88-00', type: 'Apteka 24/7', coords: [40.772, 72.308] },
  { name: '№13 "ХРАБЕК"', address: 'Андижон тумани, Ҳақиқат МФЙ, Ҳақиқат кўчаси 591-уй', hours: '08:00-22:00', phone: '(95) 893-88-00', type: 'Apteka', coords: [40.765, 72.32] },
  { name: '№14 "АСАКА"', address: 'Асака шаҳар, Умид кучаси 1-уй', hours: 'Круглосуточно', phone: '(95) 009-88-00', type: 'Apteka 24/7', coords: [40.637, 72.233] },
  { name: '№15 "ЧИНОБОД"', address: 'Баликчи тумани, Чинобод шаҳарчаси, Ойдин кучаси', hours: '08:00-22:00', phone: '(90) 760-88-00', type: 'Apteka', coords: [40.689, 72.481] },
  { name: '№16 "ХУЖАОБОД"', address: 'Хўжаобод тумани, Баҳрин МФЙ, А.Навоий кучаси', hours: '08:00-22:00', phone: '(90) 571-88-00', type: 'Apteka', coords: [40.821, 72.564] },
  { name: '№17 "ПАХТАОБОД"', address: 'Пахтаобод тумани, Юқори МФЙ, Келажак овози 17-уй', hours: '08:00-22:00', phone: '(90) 774-88-00', type: 'Apteka', coords: [40.611, 72.064] },
  { name: '№18 "КОРАСУВ"', address: 'Қўрғонтепа тумани, Қорасув шаҳарчаси, Андижон кучаси 23', hours: '08:00-22:00', phone: '(90) 142-88-00', type: 'Apteka', coords: [40.678, 72.322] },
  { name: '№19 "ПОЙТУГ"', address: 'Избоскан тумани, Пойтуғ шаҳарчаси, Мирзо Улуғбек МФЙ 10', hours: '08:00-22:00', phone: '(90) 207-88-00', type: 'Apteka', coords: [40.729, 72.248] },
  { name: '№20 "ОЛТИНКУЛ"', address: 'Олтинкул тумани, Туркистон кучаси 1-уй', hours: '08:00-22:00', phone: '(90) 383-88-00', type: 'Apteka', coords: [40.787, 72.194] },
  { name: '№21 "ПОЙТУГ 2 ЦЕНТР"', address: 'Избоскан тумани, Б.Нақшбанд кучаси 17-уй', hours: '08:00-22:00', phone: '(91) 609-88-00', type: 'Apteka', coords: [40.733, 72.251] },
  { name: '№22 "БАЛИКЧИ"', address: 'Баликчи тумани, Баликчи шоҳ кучаси', hours: '08:00-22:00', phone: '(91) 174-88-00', type: 'Apteka', coords: [40.688, 72.484] },
  { name: '№23 "МАРХАМАТ"', address: 'Марҳамат тумани, Навруз МФЙ, Мустақиллик кучаси 29-уй', hours: '08:00-22:00', phone: '(90) 060-88-00', type: 'Apteka', coords: [40.592, 72.333] },
  { name: '№24 "ШАХРИХОН"', address: 'Шаҳрихон тумани, Янги ҳаёт МФЙ, 73-уй', hours: '08:00-22:00', phone: '(90) 209-88-00', type: 'Apteka', coords: [40.724, 72.051] },
  { name: '№25 "ЖАЛАБЕК"', address: 'Андижон шаҳар, Ҳидиралиев 94-уй', hours: '08:00-22:00', phone: '(90) 385-88-00', type: 'Apteka', coords: [40.772, 72.342] },
  { name: '№26 "ЖАЛАКУДУК"', address: 'Жалақудуқ тумани, Намуна МФЙ, Ўзбекистон кучаси', hours: '08:00-22:00', phone: '(90) 547-88-00', type: 'Apteka', coords: [40.864, 72.438] },
  { name: '№27 "МАДАНИЯТ"', address: 'Пахтаобод тумани, Сой бўйи МФЙ, Олтинсой кучаси', hours: '08:00-22:00', phone: '(90) 546-88-00', type: 'Apteka', coords: [40.608, 72.068] },
  { name: '№28 "БУСТОН 6-МАКТАБ"', address: 'Андижон шаҳар, У.Юсупов кучаси 23-уй', hours: '08:00-22:00', phone: '(90) 382-88-00', type: 'Apteka', coords: [40.78, 72.348] },
  { name: '№29 "МАЙГИР"', address: 'Избоскан тумани, Мойғир КФЙ, Барҳаёт кучаси 1-уй', hours: '08:00-22:00', phone: '(90) 572-88-00', type: 'Apteka', coords: [40.739, 72.258] },
  { name: '№30 "ПИЁЗПОЯ"', address: 'Андижон шаҳар, Фаробий МФЙ, Комил Яшин кучаси 279-уй', hours: '08:00-22:00', phone: '(90) 756-88-00', type: 'Apteka', coords: [40.776, 72.354] },
  { name: '№31 "БЕЛЫЙ КИТ"', address: 'Андижон тумани, Оғуллик МФЙ, Оғуллик кучаси 957-уй', hours: '08:00-22:00', phone: '(91) 877-88-00', type: 'Apteka', coords: [40.754, 72.326] },
  { name: '№32 "СТИМОРОЛ"', address: 'Андижон шаҳар, Лермонтов кучаси 70-уй', hours: 'Круглосуточно', phone: '(90) 216-88-00', type: 'Apteka 24/7', coords: [40.785, 72.338] },
  { name: '№33 "УНИВЕРСИТЕТ"', address: 'Андижон шаҳар, Университет кучаси 16-уй', hours: '08:00-22:00', phone: '(90) 762-88-00', type: 'Apteka', coords: [40.781, 72.345] },
  { name: '№34 "САВХОЗ ХУЖАОБОД"', address: 'Хўжаобод тумани, Амир Темур кучаси 39-уй', hours: '08:00-22:00', phone: '(90) 763-88-00', type: 'Apteka', coords: [40.829, 72.57] },
  { name: '№35 "БОЗОР АСАКА"', address: 'Асака, Барака МСГ, Асака кучаси 24/а-уй', hours: '08:00-22:00', phone: '(88) 164-88-00', type: 'Apteka', coords: [40.642, 72.239] },
  { name: '№36 "КУЛЛА"', address: 'Булоқбоши тумани, Бозорбоши МФЙ, Меҳри қулол кучаси 10-уй', hours: '08:00-22:00', phone: '(88) 169-88-00', type: 'Apteka', coords: [40.805, 72.266] },
  { name: '№37 "ЧУВАМА"', address: 'Избоскан тумани, Тошкечик МФЙ, Обод диёр кучаси 105-уй', hours: '08:00-22:00', phone: '(88) 273-88-00', type: 'Apteka', coords: [40.744, 72.269] },
  { name: '№38 "ДОРИ БОЗОР"', address: 'Андижон шаҳар, Мангулик кучаси 22а-уй', hours: '08:00-22:00', phone: '(90) 769-88-00', type: 'Apteka', coords: [40.783, 72.34] },
  { name: '№39 "ХАКАН СТОЯНКА"', address: 'Андижон шаҳар, Ўзбегим МФЙ, Шевченко кучаси 16-уй', hours: '08:00-22:00', phone: '(91) 176-88-00', type: 'Apteka', coords: [40.787, 72.346] },
  { name: '№40 "ОРЗУ"', address: 'Андижон шаҳар, Пахтакор МФЙ, А.Юлдашев кучаси 56/а-уй', hours: '08:00-22:00', phone: '(90) 765-88-00', type: 'Apteka', coords: [40.778, 72.349] },
  { name: '№41 "777"', address: 'Андижон шаҳар, Ҳамдустлик МФЙ, Ўзбекистон кучаси 140/а-уй', hours: 'Круглосуточно', phone: '(90) 221-88-00', type: 'Apteka 24/7', coords: [40.791, 72.354] },
  { name: '№42 "СЕМАШКО"', address: 'Андижон шаҳар, Тошкент кучаси 33-уй', hours: 'Круглосуточно', phone: '(91) 478-88-00', type: 'Apteka 24/7', coords: [40.784, 72.352] },
  { name: '№43 "КЛИНИКА"', address: 'Андижон шаҳар, Гумбаз МФЙ, Ю.Отабеков кучаси 13/а-уй', hours: 'Круглосуточно', phone: '(91) 616-88-00', type: 'Apteka 24/7', coords: [40.781, 72.343] },
  { name: '№44 "БУЗ"', address: 'Бўстон тумани, Пиллакор МФЙ, Мустақиллик кучаси 13-уй', hours: '08:00-22:00', phone: '(91) 063-88-00', type: 'Apteka', coords: [40.871, 72.429] },
  { name: '№45 "ХОНОБОД"', address: 'Хонобод шаҳар, Хонобод кучаси 124-уй', hours: '08:00-22:00', phone: '(88) 165-88-00', type: 'Apteka', coords: [40.835, 72.542] },
  { name: '№46 "ЖАХОН БОЗОР"', address: 'Андижон шаҳар, Найман кучаси 70/а-уй', hours: '08:00-22:00', phone: '(97) 580-88-00', type: 'Apteka', coords: [40.787, 72.347] },
  { name: '№47 "ОЛД СИТИ"', address: 'Андижон шаҳар, Ғайрат МФЙ, А.Фитрат кучаси А-корпус', hours: '08:00-22:00', phone: '(88) 943-88-00', type: 'Apteka', coords: [40.779, 72.341] },
  { name: '№48 "ДУСТЛИК"', address: 'Хўжаобод тумани, Янги Фарғона МФЙ, Дўстлик кучаси 73-уй', hours: '08:00-22:00', phone: '(88) 942-88-00', type: 'Apteka', coords: [40.824, 72.566] },
  { name: '№49 "ХОЛИС"', address: 'Андижон шаҳар, Ўзбегим МФЙ, Мангулик кучаси 28-уй', hours: '08:00-22:00', phone: '(91) 487-88-00', type: 'Apteka', coords: [40.785, 72.345] },
  { name: '№50 "80-МЕТР"', address: 'Андижон шаҳар, С.Зуннунова шоҳ кучаси', hours: '08:00-22:00', phone: '(91) 498-88-00', type: 'Apteka', coords: [40.792, 72.356] },
  { name: '№51 "ТУРТКУЛ"', address: 'Избоскан тумани, Тинчлик МФЙ, Алишер Навоий кўчаси 271-уй', hours: '08:00-22:00', phone: '(95) 986-88-00', type: 'Apteka', coords: [40.735, 72.253] },
  { name: '№52 "УШ КУЧА"', address: 'Андижон шаҳар, Тараққиёт МФЙ, Дукчи эшон кўчаси 6-уй', hours: '08:00-22:00', phone: '(99) 869-88-00', type: 'Apteka', coords: [40.776, 72.343] },
  { name: '№53 "БОЛЬНИЦА КОРАСУВ"', address: 'Қўрғонтепа тумани, Мустақиллик 15 йиллиги МФЙ, Андижон кўчаси 48-уй', hours: '08:00-22:00', phone: '(95) 873-88-00', type: 'Apteka', coords: [40.676, 72.32] },
  { name: '№54 "ТЕЛЬМОН"', address: 'Андижон шаҳар, Чўлпон 100 йиллиги МФЙ, сарвонтепа кўчаси 7-уй', hours: '08:00-22:00', phone: '(95) 627-88-00', type: 'Apteka', coords: [40.777, 72.336] },
  { name: '№55 "КУЙГАН ЁР"', address: 'Андижон тумани, Саноат МФЙ, Олтин водий кўчаси 121-уй', hours: '08:00-22:00', phone: '(99) 463-88-00', type: 'Apteka', coords: [40.763, 72.324] },
  { name: '№56 "АСАКА ТЕПА БОЗОР"', address: 'Асака тумани, Камолот МФЙ, Марғилоний кўчаси 813-уй', hours: '08:00-22:00', phone: '(95) 861-88-00', type: 'Apteka', coords: [40.645, 72.242] },
  { name: '№57 "НАВРУЗ МАЛ"', address: 'Андижон шаҳар, Мустақиллик МФЙ, Машраб кўчаси 25-уй', hours: '08:00-00:00', phone: '(99) 613-88-00', type: 'Apteka', coords: [40.784, 72.347] },
  { name: 'Тошкент №1 Паркент', address: 'Мирзо Улуғбек тумани, Паркент кучаси 209-уй', hours: '08:00-22:00', phone: '(97) 833-60-00', type: 'Apteka', coords: [41.298, 69.314] },
  { name: 'Тошкент №2 Онкология', address: 'Шайхонтоҳур тумани, Фаробий кучаси 383-уй', hours: '08:00-22:00', phone: '(99) 861-60-85', type: 'Apteka', coords: [41.315, 69.272] },
  { name: 'Тошкент №3 Перфектум', address: 'Миробод тумани, Тарас Шевченко кучаси 36А-уй', hours: '08:00-22:00', phone: '(99) 027-60-85', type: 'Apteka', coords: [41.302, 69.287] },
  { name: 'Тошкент №5 Квартал', address: 'Чилонзор тумани, Квартал 9-5А', hours: '08:00-22:00', phone: '(99) 222-60-85', type: 'Apteka', coords: [41.28, 69.214] },
  { name: 'Тошкент №6 Фарҳадский', address: 'Учтепа тумани, 13-кв, 26А-уй', hours: '08:00-22:00', phone: '(91) 173-88-00', type: 'Apteka', coords: [41.295, 69.256] },
  { name: 'Тошкент №7 Себзор', address: 'Олмазор тумани, Себзор МФЙ 52-уй', hours: '08:00-22:00', phone: '(88) 003-88-00', type: 'Apteka', coords: [41.318, 69.251] },
  { name: 'Тошкент №8 Юнусобод', address: 'Юнусобод тумани, Мойқўрғон кучаси Квартал 6', hours: '08:00-22:00', phone: '(88) 747-88-00', type: 'Apteka', coords: [41.361, 69.289] },
  { name: '№58 "БУЛОКБОШИ"', address: 'Булоқбоши тумани, М.Исмоилий МФЙ, Мирза Камол Исмоилий кучаси 147-уй', hours: '08:00-22:00', phone: '(99) 574-88-00', type: 'Apteka', coords: [40.806, 72.264] },
  { name: '№59 "ЧЕМ"', address: 'Андижон тумани, Чем МФЙ, Навқирон кучаси 960-уй', hours: '08:00-22:00', phone: '(99) 594-88-00', type: 'Apteka', coords: [40.758, 72.308] },
  { name: '№60 "ОЛТИНКУЛ 2"', address: 'Олтинкул тумани, Марказ МФЙ, Чинобод кучаси 1/a-уй', hours: '08:00-22:00', phone: '(91) 614-88-00', type: 'Apteka', coords: [40.792, 72.186] },
  { name: '№61 "ГОР БОЛЬНИЦА"', address: 'Андижон шаҳар, Гумбаз МФЙ, Юсуф Отабеков кучаси 7-уй', hours: '08:00-22:00', phone: '(99) 549-88-00', type: 'Apteka', coords: [40.7805, 72.344] },
  { name: 'ФИЛИАЛ №1 "ФРУНЗОВСКИЙ"', address: 'Фарғона шаҳар, Алишер Навои кучаси 70В', hours: 'Круглосуточно', phone: '(77) 201-88-00', type: 'Apteka 24/7', coords: [40.374, 71.787] },
  { name: 'ФИЛИАЛ №2 "ТОШЛОК"', address: 'Фарғона вилояти, Тошлоқ тумани, Алишера Навои кучаси 69-уй', hours: 'Круглосуточно', phone: '(77) 206-88-00', type: 'Apteka 24/7', coords: [40.512, 71.645] },
  { name: '№62 "ДАРХОН"', address: 'Андижон тумани, Гумбаз МФЙ, Зиё кучаси 895-уй', hours: '08:00-22:00', phone: '(99) 762-88-00', type: 'Apteka', coords: [40.752, 72.327] },
  { name: '№63 "НАРГИЗ БУЛОКБОШИ"', address: 'Хўжаобод тумани, Кўприкбоши МФЙ, Кўприкбоши кучаси 93-уй', hours: '08:00-22:00', phone: '(95) 549-88-00', type: 'Apteka', coords: [40.826, 72.549] },
  { name: '№64 "КАРДИОЛОГИЯ"', address: 'Андижон шаҳар, Ўзгариш МФЙ, Обод кучаси 13', hours: '08:00-22:00', phone: '(77) 073-88-00', type: 'Apteka', coords: [40.785, 72.343] },
  { name: '№65 "ТАБАССУМ"', address: 'Андижон шаҳар, Маданият кучаси 24', hours: '08:00-22:00', phone: '(77) 262-88-00', type: 'Apteka', coords: [40.783, 72.338] },
  { name: '№66 "САРВАР"', address: 'Андижон шаҳар, Сариқўз МФЙ, Садбар кучаси 9-уй', hours: '08:00-22:00', phone: '(99) 870-88-00', type: 'Apteka', coords: [40.7825, 72.351] },
  { name: '№67 "МУСТАҚИЛЛИК"', address: 'Андижон тумани, Мустақиллик МФЙ, Нақши жон кўчаси 6', hours: '08:00-22:00', phone: '(99) 645-88-00', type: 'Apteka', coords: [40.759, 72.3205] },
  { name: '№68 "ДИЛФУЗ"', address: 'Андижон шаҳар, Бухоро кучаси 34-уй', hours: '08:00-22:00', phone: '(99) 782-88-00', type: 'Apteka', coords: [40.7725, 72.3485] },
  { name: '№69 "ШАФАК"', address: 'Андижон шаҳар, Юсуф Хос Хожиб кучаси 18-уй', hours: '08:00-22:00', phone: '(99) 354-88-00', type: 'Apteka', coords: [40.784, 72.3435] },
  { name: '№70 "МАРҲАМАТ 2"', address: 'Мархамат тумани, Лайло МФЙ, Истиқлол кучаси 44-уй', hours: '08:00-22:00', phone: '(91) 338-88-00', type: 'Apteka', coords: [40.588, 72.3275] },
  { name: '№71 "ОҚДАРЁ"', address: 'Андижон шаҳар, Ғузал МФЙ, Хамидуллаев кучаси 15-уй', hours: '08:00-22:00', phone: '(99) 196-88-00', type: 'Apteka', coords: [40.788, 72.36] },
  { name: '№72 "МУЗЛО"', address: 'Андижон тумани, Корам МФЙ, Жонатош кучаси 7-уй', hours: '08:00-22:00', phone: '(99) 848-88-00', type: 'Apteka', coords: [40.762, 72.3005] },
  { name: '№73 "ШАРОФ"', address: 'Андижон тумани, Оқтепа МФЙ, Дўстлик кучаси 11-уй', hours: '08:00-22:00', phone: '(99) 283-88-00', type: 'Apteka', coords: [40.77, 72.288] },
  { name: '№74 "СУХАВАТ"', address: 'Андижон шаҳар, Тошкент кучаси 22-уй', hours: '08:00-22:00', phone: '(99) 204-88-00', type: 'Apteka', coords: [40.782, 72.352] },
  { name: '№75 "ФАРҲОД"', address: 'Фарғона шахар, Боғи Сайёд кучаси 7-уй', hours: 'Круглосуточно', phone: '(77) 263-88-00', type: 'Apteka 24/7', coords: [40.388, 71.79] },
];

const AnimatedCounter = ({ value, duration = 2 }: { value: number; duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame = 0;

    const tick = (time: number) => {
      if (startTime === null) startTime = time;
      const progress = Math.min((time - startTime) / (duration * 1000), 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.round(eased * value));

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(tick);
      }
    };

    animationFrame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <>{count}</>;
};

const haversine = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const getDistanceFromUser = (branch: Branch, userLat: number, userLng: number) =>
  haversine(userLat, userLng, branch.coords[0], branch.coords[1]);

const sortBranchesByDistance = (branches: Branch[], userLat: number, userLng: number) =>
  [...branches].sort((a, b) => {
    const distanceA = getDistanceFromUser(a, userLat, userLng);
    const distanceB = getDistanceFromUser(b, userLat, userLng);
    return distanceA - distanceB;
  });

const getNearbyBranches = (userLat: number, userLng: number, radiusKm = 2) =>
  sortBranchesByDistance(
    ALL_BRANCHES.filter((branch) => getDistanceFromUser(branch, userLat, userLng) <= radiusKm),
    userLat,
    userLng,
  );

const formatDistanceKm = (value: number) => {
  if (value < 1) return `${Math.round(value * 1000)} м`;
  return `${value.toFixed(1)} км`;
};

const t = {
  ru: {
    callCenter: "Единый Колл-центр",
    onlinePharmacy: "Онлайн Аптека",
    telegramBot: "Заказ в Telegram (Bot)",
    website: "Официальный сайт",
    services: "Услуги и Сервисы",
    locationsTitle: "Филиалы и Карта",
    locationsCount: "Локаций",
    heroTitle: "Здоровый образ жизни под защитой!",
    supportTitle: "Написать в поддержку",
    supportSubtitle: "Жалобы, вопросы и обратная связь",
    cityWide: "Всего по городу",
    nothingFound: "Ничего не найдено",
    twentyFourSeven: "Круглосуточные аптеки",
    twentyFourSevenDesc: "Оригинальные препараты, широкий ассортимент лекарств, витаминов и косметики.",
    lab: "Лабораторная диагностика",
    labDesc: "Точные анализы на современном оборудовании, выезд квалифицированных специалистов на дом.",
    open247: "Открыто 24/7",
    openBotAria: "Открыть бот в Telegram",
    pointsLabel: "Точек",
    routesTitle: "Локации и маршруты",
    findNearestBranch: "Найдите ближайший филиал",
    branchesCountWord: "филиалов",
    searchPlaceholder: "Найти филиал, адрес...",
    findNearby: "Найти рядом",
    nearbyError: "Не удалось определить геолокацию",
  },
  uz: {
    callCenter: "Yagona Call-markaz",
    onlinePharmacy: "Onlayn Dorixona",
    telegramBot: "Telegram orqali buyurtma (Bot)",
    website: "Rasmiy sayt",
    services: "Xizmatlar va Servislar",
    locationsTitle: "Filiallar va Xarita",
    locationsCount: "Lokatsiyalar",
    heroTitle: "SOG'LOM HAYOT HIMOYASIDA!",
    supportTitle: "Qo'llab-quvvatlashga yozish",
    supportSubtitle: "Shikoyatlar, savollar va fikr-mulohazalar",
    cityWide: "Shahar bo'ylab",
    nothingFound: "Hech narsa topilmadi",
    twentyFourSeven: "Tunu-kun dorixonalar",
    twentyFourSevenDesc: "Asl dorilar, keng turdagi dori-darmonlar, vitaminlar va kosmetika.",
    lab: "Laboratoriya diagnostikasi",
    labDesc: "Zamonaviy uskunalarda aniq tahlillar, malakali mutaxassislarning uyga tashrifi.",
    open247: "24/7 Ochiq",
    openBotAria: "Botni Telegramda ochish",
    pointsLabel: "Nuqtalar",
    routesTitle: "Lokatsiyalar va marshrutlar",
    findNearestBranch: "Eng yaqin filialni toping",
    branchesCountWord: "filiallar",
    searchPlaceholder: "Filial yoki manzilni qidirish...",
    findNearby: "Yaqinini top",
    nearbyError: "Geolokatsiyani aniqlab bo'lmadi",
  },
  en: {
    callCenter: "Unified Call Center",
    onlinePharmacy: "Online Pharmacy",
    telegramBot: "Order on Telegram (Bot)",
    website: "Official Website",
    services: "Services & Facilities",
    locationsTitle: "Branches & Map",
    locationsCount: "Locations",
    heroTitle: "Healthy Life Under Protection!",
    supportTitle: "Write to Support",
    supportSubtitle: "Complaints, questions, and feedback",
    cityWide: "Across the city",
    nothingFound: "No results found",
    twentyFourSeven: "24/7 Pharmacies",
    twentyFourSevenDesc: "Original drugs, a wide range of medicines, vitamins, and cosmetics.",
    lab: "Laboratory diagnostics",
    labDesc: "Accurate tests on modern equipment, home visits by qualified specialists.",
    open247: "Open 24/7",
    openBotAria: "Open bot in Telegram",
    pointsLabel: "Points",
    routesTitle: "Locations and routes",
    findNearestBranch: "Find the nearest branch",
    branchesCountWord: "branches",
    searchPlaceholder: "Search branch, address...",
    findNearby: "Find nearby",
    nearbyError: "Could not get your location",
  },
} as const;

const Logo = () => {
  const { scrollY } = useScroll();
  const leftX = useTransform(scrollY, [0, 200], [0, -200]);
  const rightX = useTransform(scrollY, [0, 200], [0, 200]);
  const leftY = useTransform(scrollY, [0, 200], [0, 80]);
  const rightY = useTransform(scrollY, [0, 200], [0, 120]);
  const leftRotate = useTransform(scrollY, [0, 200], [0, -25]);
  const rightRotate = useTransform(scrollY, [0, 200], [0, 35]);
  const logoScale = useTransform(scrollY, [0, 150], [0.5, 1.15]);
  const logoOpacity = useTransform(scrollY, [0, 80], [0, 1]);
  const logoY = useTransform(scrollY, [0, 150], [40, 0]);
  const glowOpacity = useTransform(scrollY, [0, 100, 200], [0, 1, 0]);
  const glowScale = useTransform(scrollY, [0, 100], [0.5, 2.5]);
  const capsuleOpacity = useTransform(scrollY, [150, 300], [1, 0]);

  return (
    <div className="relative flex justify-center items-center w-full z-10 perspective-[2000px] h-[120px] mt-4 mb-3">
      <motion.div
        style={{ opacity: glowOpacity, scale: glowScale }}
        className="absolute w-[180px] h-[90px] bg-[#3db2ea]/50 dark:bg-[#3db2ea]/60 blur-[54px] rounded-full z-0 pointer-events-none"
      />
      <motion.div
        style={{ opacity: glowOpacity, scale: glowScale }}
        className="absolute w-[120px] h-[64px] bg-brand-red/40 dark:bg-brand-red/60 blur-[34px] rounded-full z-0 pointer-events-none"
      />

      <motion.div
        style={{ scale: logoScale, opacity: logoOpacity, y: logoY }}
        className="flex justify-center z-10 absolute bg-white/95 dark:bg-slate-800/95 backdrop-blur-2xl px-6 py-3 rounded-[2.5rem] shadow-[0_26px_90px_-24px_rgba(21,49,90,0.28),inset_0_2px_10px_rgba(255,255,255,0.7)] dark:shadow-[0_26px_90px_-24px_rgba(0,0,0,0.8),inset_0_2px_10px_rgba(255,255,255,0.05)] border border-white/80 dark:border-slate-700/75"
      >
        <img
          src={logoImage}
          alt="Akmal Farm logo"
          className="h-[4.8rem] sm:h-[6rem] w-auto object-contain drop-shadow-[0_10px_20px_rgba(21,49,90,0.18)]"
        />
      </motion.div>

      <motion.div
        initial={{ scale: 0.6, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 70, damping: 14, delay: 0.2 }}
        style={{ opacity: capsuleOpacity }}
        className="absolute z-30 w-[300px] sm:w-[340px] h-[120px] sm:h-[136px] flex flex-row pointer-events-none drop-shadow-[0_40px_40px_rgba(0,0,0,0.6)]"
      >
        <motion.div
          style={{
            x: leftX,
            y: leftY,
            rotateZ: leftRotate,
            background: "linear-gradient(170deg, #4a7ab5 0%, #2a5a8f 8%, #1a3d6b 18%, #15315a 35%, #0d2240 55%, #071630 75%, #030b1a 100%)",
          }}
          className="w-1/2 h-full rounded-l-[150px] relative origin-right shadow-2xl overflow-hidden"
        >
          <div className="absolute inset-x-0 top-0 h-[45%] rounded-tl-[150px]" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 40%, transparent 100%)" }} />
          <div className="absolute inset-x-0 bottom-0 h-[35%]" style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)" }} />
        </motion.div>

        <motion.div
          style={{
            x: rightX,
            y: rightY,
            rotateZ: rightRotate,
            background: "linear-gradient(170deg, #f05565 0%, #d93345 8%, #c41d30 18%, #a81525 35%, #8a0e1c 55%, #5c0812 75%, #2e0308 100%)",
          }}
          className="w-1/2 h-full rounded-r-[150px] relative origin-left shadow-2xl overflow-hidden"
        >
          <div className="absolute inset-x-0 top-0 h-[45%] rounded-tr-[150px]" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.12) 40%, transparent 100%)" }} />
          <div className="absolute inset-x-0 bottom-0 h-[35%]" style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)" }} />
        </motion.div>
      </motion.div>
    </div>
  );
};

const ScrollCapsule = ({ className = "", scale = 1, initialRotate = -20 }: { className?: string; scale?: number; initialRotate?: number }) => {
  const { scrollYProgress } = useScroll();
  const topY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const topRotate = useTransform(scrollYProgress, [0, 1], [0, -15]);
  const bottomY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const bottomRotate = useTransform(scrollYProgress, [0, 1], [0, 15]);
  const rotateWrapper = useTransform(scrollYProgress, [0, 1], [initialRotate, initialRotate + 30]);

  return (
    <motion.div className={`absolute drop-shadow-[0_25px_35px_rgba(21,49,90,0.35)] ${className}`} style={{ rotate: rotateWrapper, scale }}>
      <div className="relative w-32 h-64 flex flex-col items-center justify-center">
        <motion.div style={{ y: topY, rotate: topRotate }} className="w-32 h-32 rounded-t-[5rem] relative z-10 overflow-hidden shadow-2xl border border-white/30 border-b-0 origin-bottom">
          <div className="absolute inset-0 bg-brand-blue" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-white/30 to-black/50" />
        </motion.div>
        <motion.div style={{ y: bottomY, rotate: bottomRotate }} className="w-32 h-32 rounded-b-[5rem] relative z-10 overflow-hidden shadow-2xl border border-white/30 border-t-0 origin-top">
          <div className="absolute inset-0 bg-brand-red" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-white/30 to-black/50" />
        </motion.div>
      </div>
    </motion.div>
  );
};

const FloatingCapsule = ({ className = "", scale = 1, delay = 0, duration = 10 }: { className?: string; scale?: number; delay?: number; duration?: number }) => {
  return (
    <motion.div
      className={`absolute drop-shadow-[0_15px_25px_rgba(21,49,90,0.3)] ${className}`}
      style={{ scale }}
      animate={{ y: [0, -40, 0], x: [0, 15, -10, 0], rotate: [0, 20, -10, 0] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <div className="w-20 h-40 flex flex-col rounded-[3rem] overflow-hidden shadow-[inset_0_0_10px_rgba(0,0,0,0.2)] border border-white/40">
        <div className="w-full h-1/2 bg-brand-blue relative">
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-white/30 to-black/50" />
        </div>
        <div className="w-full h-1/2 bg-brand-red relative border-t-[1.5px] border-white/30">
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-white/30 to-black/50" />
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [lang, setLang] = useState<LangCode>("ru");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [openSection, setOpenSection] = useState<"services" | "locations" | null>("locations");
  const [mapSource, setMapSource] = useState<"leaflet" | "google">("leaflet");
  const [searchQuery, setSearchQuery] = useState("");
  const [nearbyCount, setNearbyCount] = useState<number | null>(null);
  const [nearbyBranches, setNearbyBranches] = useState<Branch[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const currentT = t[lang];
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    if (mapSource !== "leaflet" || openSection !== "locations" || !mapContainerRef.current) {
      return;
    }

    if (mapRef.current) {
      mapRef.current.invalidateSize();
      return;
    }

    const map = L.map(mapContainerRef.current, {
      center: [40.79, 72.34],
      zoom: 10,
      zoomControl: true,
      attributionControl: false,
      scrollWheelZoom: true,
      fadeAnimation: true,
    });

    const addFallbackMap = () => {
      const roads = [
        [[40.57, 71.95], [40.92, 72.75]],
        [[40.62, 71.72], [40.84, 72.92]],
        [[40.71, 71.84], [40.78, 72.97]],
        [[40.78, 71.86], [40.82, 73.0]],
        [[40.68, 71.78], [40.89, 72.8]],
      ];

      const fallbackLayer = L.layerGroup(
        roads.map((line) =>
          L.polyline(line as [number, number][], {
            color: "#dfeaf5",
            weight: 2,
            opacity: 0.8,
            dashArray: "6 8",
          }),
        ),
      );

      fallbackLayer.addTo(map);
      return fallbackLayer;
    };

    const tileLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    });

    tileLayer.addTo(map);
    tileLayer.on("tileerror", () => {
      if (!map.hasLayer(map as any)._fallbackMapLayer) {
        (map as any)._fallbackMapLayer = addFallbackMap();
      }
    });

    const markers = ALL_BRANCHES.map((branch) => {
      const marker = L.circleMarker(branch.coords, {
        radius: 7,
        color: branch.type === "Apteka 24/7" ? "#ef4444" : "#2563eb",
        fillColor: branch.type === "Apteka 24/7" ? "#ef4444" : "#2563eb",
        fillOpacity: 0.95,
        weight: 2,
      }).addTo(map);

      marker.bindPopup(`<strong>${branch.name}</strong><br>${branch.address}<br>${branch.hours}<br>${branch.phone}`);
      return marker;
    });

    const branchGroup = L.featureGroup(markers);
    const bounds = branchGroup.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds.pad(0.18), { animate: false, maxZoom: 11 });
    } else {
      map.setView([40.79, 72.34], 10);
    }

    mapRef.current = map;

    const refreshMap = () => {
      requestAnimationFrame(() => map.invalidateSize());
    };

    refreshMap();
    window.setTimeout(refreshMap, 150);
    window.setTimeout(refreshMap, 500);
    window.addEventListener("resize", refreshMap);

    const resizeObserver = new ResizeObserver(() => refreshMap());
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", refreshMap);
      map.remove();
      mapRef.current = null;
    };
  }, [mapSource, openSection]);

  const filteredBranches = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const baseBranches = nearbyBranches.length > 0 ? nearbyBranches : ALL_BRANCHES;

    if (!query) return baseBranches;

    return baseBranches.filter((branch) =>
      branch.name.toLowerCase().includes(query) ||
      branch.address.toLowerCase().includes(query) ||
      branch.phone.toLowerCase().includes(query),
    );
  }, [searchQuery, nearbyBranches]);

  const nearestBranch = nearbyBranches[0] ?? null;

  const total24 = ALL_BRANCHES.filter((branch) => branch.type === "Apteka 24/7").length;
  const totalRegular = ALL_BRANCHES.filter((branch) => branch.type === "Apteka").length;

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));
  const toggleSection = (section: "services" | "locations") => {
    setOpenSection((prev) => (prev === section ? null : section));
    if (section !== "locations") {
      setSearchQuery("");
    }
  };

  const requestNearestBranches = (showError = true) => {
    if (!navigator.geolocation) {
      if (showError) setGeoError(currentT.nearbyError);
      return;
    }

    setGeoError(null);
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const nearby = getNearbyBranches(userLat, userLng, 2);

        setUserLocation({ lat: userLat, lng: userLng });
        setNearbyBranches(nearby);
        setNearbyCount(nearby.length);
        setGeoLoading(false);

        if (mapRef.current && nearby.length > 0) {
          const nearest = nearby[0];
          const allBounds = L.latLngBounds([
            ...nearby.map((branch) => branch.coords),
            [userLat, userLng],
          ]);

          mapRef.current.fitBounds(allBounds, {
            padding: [24, 24],
            animate: true,
            duration: 1.2,
            maxZoom: 12,
          });

          setTimeout(() => {
            if (mapRef.current) {
              mapRef.current.setView([userLat, userLng], Math.max(mapRef.current.getZoom(), 11), {
                animate: true,
                duration: 0.8,
              });
            }
          }, 200);

          if (nearest) {
            const marker = L.circleMarker(nearest.coords, {
              radius: 9,
              color: "#0f172a",
              fillColor: "#facc15",
              fillOpacity: 1,
              weight: 2,
            }).addTo(mapRef.current);
            setTimeout(() => marker.remove(), 1800);
          }
        }
      },
      () => {
        setNearbyBranches([]);
        setNearbyCount(null);
        setUserLocation(null);
        setGeoLoading(false);
        if (showError) setGeoError(currentT.nearbyError);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  };

  const handleNearby = () => requestNearestBranches(true);

  useEffect(() => {
    requestNearestBranches(false);
  }, []);

  return (
    <div className={`min-h-screen flex items-start justify-center font-sans py-0 sm:py-8 sm:px-4 relative overflow-hidden ${theme === "light" ? "bg-[#f1f5f9]" : "bg-slate-900"} transition-colors duration-500`}>
      <div className="w-full max-w-[480px] md:max-w-[640px] bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl min-h-screen sm:min-h-[850px] md:min-h-[920px] shadow-[0_20px_80px_-10px_rgba(21,49,90,0.2)] dark:shadow-[0_20px_80px_-10px_rgba(0,0,0,0.6)] relative sm:rounded-[40px] md:rounded-[44px] overflow-hidden flex flex-col mx-auto sm:border-[8px] border-white/50 dark:border-slate-800/50 sm:ring-1 ring-slate-900/5 z-10 transition-colors duration-500">
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center w-[34px] h-[34px] bg-white/20 backdrop-blur-md rounded-full border border-white/30 shadow-lg text-white hover:bg-white/30 transition-colors focus:outline-none relative overflow-hidden"
            aria-label="Toggle Theme"
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === "light" ? (
                <motion.div key="moon" initial={{ y: -20, opacity: 0, rotate: -90 }} animate={{ y: 0, opacity: 1, rotate: 0 }} exit={{ y: 20, opacity: 0, rotate: 90 }} transition={{ duration: 0.2 }} className="absolute"><Moon className="w-4 h-4" /></motion.div>
              ) : (
                <motion.div key="sun" initial={{ y: -20, opacity: 0, rotate: -90 }} animate={{ y: 0, opacity: 1, rotate: 0 }} exit={{ y: 20, opacity: 0, rotate: 90 }} transition={{ duration: 0.2 }} className="absolute"><Sun className="w-4 h-4" /></motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          <div className="flex items-center bg-white/20 backdrop-blur-md rounded-full p-1 border border-white/30 shadow-lg">
            {(["ru", "uz", "en"] as LangCode[]).map((langCode) => (
              <button
                key={langCode}
                onClick={() => setLang(langCode)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all leading-none pt-2 ${lang === langCode ? "bg-white text-brand-blue shadow-sm" : "text-white hover:bg-white/30"}`}
              >
                {langCode}
              </button>
            ))}
          </div>
        </div>

        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1587155829148-5c1cfb9b2ff9?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" style={{ opacity: 0.03, mixBlendMode: "luminosity" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-200/10 via-slate-200/40 to-[#f8fafc]/90" />
          <FloatingCapsule className="left-[5%] top-[15%] blur-[3px]" scale={0.8} duration={10} delay={0} />
          <FloatingCapsule className="right-[5%] top-[60%] blur-[4px]" scale={0.9} duration={12} delay={2} />
          <FloatingCapsule className="left-[45%] top-[85%] blur-[3px]" scale={0.7} duration={14} delay={1} />
          <ScrollCapsule className="right-[15%] top-[35%]" scale={0.45} initialRotate={-15} />
          <ScrollCapsule className="left-[15%] top-[60%]" scale={0.35} initialRotate={25} />
          <ScrollCapsule className="left-[40%] top-[40%]" scale={0.5} initialRotate={45} />
        </div>

        <div className="h-52 relative overflow-hidden shrink-0 shadow-inner z-10 flex">
          <div className="absolute inset-0 bg-brand-blue" />
          <div className="absolute top-0 right-0 w-[60%] h-full bg-brand-red" style={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)" }} />
          <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>

        <div className="px-5 md:px-7 pb-10 -mt-20 flex-1 flex flex-col relative z-20">
          <div className="flex justify-center mb-5 md:mb-6"><Logo /></div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="text-center mb-8 md:mb-9 px-2 md:px-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-red/10 text-brand-red mb-5 shadow-sm border border-brand-red/10">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-brand-red" /></span>
              <span className="text-[10px] font-bold uppercase tracking-widest mt-0.5">{currentT.open247}</span>
            </div>
            <h1 className="text-slate-800 dark:text-white font-black text-2xl md:text-[2rem] mb-2 leading-tight">{currentT.heroTitle}</h1>

            <div className="flex flex-col gap-4">
              <motion.a whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} href="tel:1080" className="group relative w-full bg-gradient-to-b from-brand-blue to-[#0e2240] text-white p-4 rounded-[1.5rem] flex items-center shadow-[0_8px_25px_-5px_rgba(21,49,90,0.4)] border border-[#2a4570] overflow-hidden">
                <motion.div className="w-[52px] h-[52px] bg-white/10 rounded-2xl flex items-center justify-center shrink-0 backdrop-blur-md border border-white/20" whileHover={{ rotate: [-5, 5, -5, 0], transition: { duration: 0.4 } }}>
                  <Phone className="w-6 h-6 text-white" />
                </motion.div>
                <div className="ml-4 flex-1 text-left">
                  <div className="font-bold text-[22px] tracking-tight leading-tight">1080</div>
                  <div className="text-white/60 text-[11px] font-bold uppercase tracking-widest mt-1">{currentT.callCenter}</div>
                </div>
                <motion.div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors" whileHover={{ x: 3, y: -3 }}>
                  <ArrowUpRight className="w-5 h-5" />
                </motion.div>
              </motion.a>

              <motion.a whileHover={{ scale: 1.035, y: -3 }} whileTap={{ scale: 0.985 }} href="https://t.me/akmalfarm_support_bot" target="_blank" rel="noreferrer" aria-label={currentT.openBotAria} className="group support-cta relative w-full bg-gradient-to-r from-[#0f172a] to-[#15315a] text-white p-4 rounded-[1.5rem] flex items-center justify-between overflow-hidden">
                <div className="flex items-center gap-3 relative z-10">
                  <motion.div initial={{ scale: 1 }} whileHover={{ scale: 1.08, rotate: 6 }} transition={{ type: "spring", stiffness: 300, damping: 18 }} className="w-[52px] h-[52px] rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md">
                    <Send className="w-6 h-6 text-white" />
                  </motion.div>
                  <div className="text-left">
                    <div className="font-bold text-[15px] tracking-tight">{currentT.supportTitle}</div>
                    <div className="text-[11px] text-white/80 mt-1 font-semibold">{currentT.supportSubtitle}</div>
                  </div>
                </div>
                <motion.div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center relative z-10" whileHover={{ scale: 1.035, y: -3 }} whileTap={{ scale: 0.97 }}>
                  <ArrowUpRight className="w-5 h-5 text-white" />
                </motion.div>
              </motion.a>

              <motion.a whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} href="https://t.me/Akmalfarm_online_bot" target="_blank" rel="noopener noreferrer" className="group relative w-full bg-gradient-to-b from-brand-red to-[#9b1524] text-white p-4 rounded-[1.5rem] flex items-center shadow-[0_8px_25px_-5px_rgba(196,29,48,0.4)] border border-[#a81929] overflow-hidden">
                <motion.div className="w-[52px] h-[52px] bg-white/10 rounded-2xl flex items-center justify-center shrink-0 backdrop-blur-md border border-white/20" whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}>
                  <ShoppingCart className="w-6 h-6 text-white" />
                </motion.div>
                <div className="ml-4 flex-1 text-left">
                  <div className="font-bold text-[18px] tracking-tight leading-tight">{currentT.onlinePharmacy}</div>
                  <div className="text-white/60 text-[11px] font-bold uppercase tracking-widest mt-1">{currentT.telegramBot}</div>
                </div>
                <motion.div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors" whileHover={{ x: 3, y: -3 }}>
                  <ArrowUpRight className="w-5 h-5" />
                </motion.div>
              </motion.a>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-3.5 mt-4 md:mt-5 mb-4 md:mb-5">
            <motion.a whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }} href="https://t.me/akmalfarmofficial" target="_blank" rel="noopener noreferrer" className="relative bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl text-slate-800 dark:text-white p-4 rounded-[1.5rem] flex flex-col items-center justify-center gap-3 shadow-[0_8px_30px_-5px_rgba(0,0,0,0.05)] border border-white/60 dark:border-slate-700/50 group overflow-hidden">
              <motion.div className="w-12 h-12 rounded-2xl bg-[#229ED9]/10 dark:bg-[#229ED9]/20 flex items-center justify-center" whileHover={{ scale: 1.15, rotate: 10 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <Send className="w-6 h-6 text-[#229ED9] ml-1" />
              </motion.div>
              <span className="font-bold text-[13px] uppercase tracking-wide text-slate-700 dark:text-slate-300">Telegram</span>
            </motion.a>

            <motion.a whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }} href="https://instagram.com/akmalfarmofficial" target="_blank" rel="noopener noreferrer" className="relative bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl text-slate-800 dark:text-white p-4 rounded-[1.5rem] flex flex-col items-center justify-center gap-3 shadow-[0_8px_30px_-5px_rgba(0,0,0,0.05)] border border-white/60 dark:border-slate-700/50 group overflow-hidden">
              <motion.div className="w-12 h-12 rounded-2xl bg-[#E1306C]/10 dark:bg-[#E1306C]/20 flex items-center justify-center" whileHover={{ scale: 1.15, rotate: -10 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <Instagram className="w-6 h-6 text-[#E1306C]" />
              </motion.div>
              <span className="font-bold text-[13px] uppercase tracking-wide text-slate-700 dark:text-slate-300">Instagram</span>
            </motion.a>
          </div>

          <motion.a whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} href="https://akmalfarm.uz" target="_blank" rel="noopener noreferrer" className="w-full bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl hover:bg-white/90 dark:hover:bg-slate-700/80 border border-white/60 dark:border-slate-700/50 text-slate-700 dark:text-slate-200 p-4 rounded-[1.5rem] flex items-center shadow-[0_8px_30px_-5px_rgba(0,0,0,0.05)] group transition-all hover:shadow-[0_8px_30px_-5px_rgba(21,49,90,0.15)]">
            <motion.div className="w-[52px] h-[52px] rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700/50 flex items-center justify-center shrink-0 group-hover:bg-brand-blue/5 transition-colors" whileHover={{ rotate: 180 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}>
              <Globe className="w-6 h-6 text-brand-blue" />
            </motion.div>
            <div className="ml-4 flex-1 text-left">
              <div className="font-bold text-[15px] group-hover:text-brand-blue transition-colors">{currentT.website}</div>
              <div className="text-slate-400 dark:text-slate-500 text-[11px] font-bold uppercase tracking-widest mt-1">akmalfarm.uz</div>
            </div>
            <motion.div whileHover={{ x: 3, y: -3 }}><ArrowUpRight className="w-5 h-5 text-slate-300 dark:text-slate-500 group-hover:text-brand-blue transition-colors" /></motion.div>
          </motion.a>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.5 }} className="flex flex-col gap-3.5 mt-4">
            <div className="bg-white dark:bg-slate-800/80 border border-slate-100/80 dark:border-slate-700/50 rounded-[1.5rem] overflow-hidden shadow-[0_4px_20px_-5px_rgba(0,0,0,0.03)] transition-colors">
              <button onClick={() => toggleSection("services")} className="w-full p-4 md:p-5 flex items-center justify-between transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 relative group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-blue/5 dark:bg-brand-blue/10 flex items-center justify-center text-brand-blue group-hover:bg-brand-blue/10 transition-colors"><Cross className="w-5 h-5" /></div>
                  <span className="font-bold text-[15px] text-slate-800 dark:text-slate-200">{currentT.services}</span>
                </div>
                <motion.div animate={{ rotate: openSection === "services" ? 180 : 0 }} className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center border border-slate-100 dark:border-slate-700/50 transition-colors"><ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500" /></motion.div>
              </button>

              <AnimatePresence>
                {openSection === "services" && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-700/50 bg-slate-50/30 dark:bg-slate-800/30 transition-colors">
                      <div className="mt-5 mb-2 bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/70 shadow-sm flex items-center justify-between group overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 dark:bg-brand-blue/10 rounded-bl-full -z-10 group-hover:scale-125 transition-transform duration-500" />
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue shadow-inner"><MapPin className="w-6 h-6" /></div>
                          <div className="flex flex-col"><span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{currentT.locationsTitle}</span><span className="font-bold text-[14px] text-slate-700 dark:text-slate-300 leading-tight">{currentT.cityWide}</span></div>
                        </div>
                        <div className="text-4xl font-black text-brand-blue tabular-nums"><AnimatedCounter value={ALL_BRANCHES.length} /></div>
                      </div>

                      <div className="flex items-center gap-4 py-5 border-b border-slate-100 dark:border-slate-700/50 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-blue-100/50 dark:bg-blue-900/40 flex items-center justify-center shrink-0 shadow-inner"><Clock className="w-5 h-5 text-brand-blue dark:text-[#4da8da]" /></div>
                        <div className="flex-1"><div className="font-bold text-[14px] text-brand-blue dark:text-[#4da8da] mb-1">{currentT.twentyFourSeven}</div><div className="text-[12px] text-slate-500 dark:text-slate-400 leading-snug font-medium pr-2">{currentT.twentyFourSevenDesc}</div></div>
                        <div className="flex flex-col items-center justify-center bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-xl border border-blue-100 dark:border-blue-800/30 min-w-[70px]">
                          <span className="text-2xl font-black text-brand-blue dark:text-[#4da8da] leading-none tabular-nums"><AnimatedCounter value={total24} /></span>
                          <span className="text-[9px] font-bold text-brand-blue/60 dark:text-[#4da8da]/60 uppercase tracking-wider mt-1">{currentT.pointsLabel}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 pt-5 pb-2">
                        <div className="w-10 h-10 rounded-full bg-red-100/50 dark:bg-red-900/40 flex items-center justify-center shrink-0 shadow-inner"><FlaskConical className="w-5 h-5 text-brand-red dark:text-[#ff6b81]" /></div>
                        <div className="flex-1"><div className="font-bold text-[14px] text-brand-red dark:text-[#ff6b81] mb-1">{currentT.lab}</div><div className="text-[12px] text-slate-500 dark:text-slate-400 leading-snug font-medium pr-2">{currentT.labDesc}</div></div>
                        <div className="flex flex-col items-center justify-center bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-xl border border-red-100 dark:border-red-800/30 min-w-[70px]">
                          <span className="text-2xl font-black text-brand-red dark:text-[#ff6b81] leading-none tabular-nums"><AnimatedCounter value={totalRegular} /></span>
                          <span className="text-[9px] font-bold text-brand-red/60 dark:text-[#ff6b81]/60 uppercase tracking-wider mt-1">{currentT.pointsLabel}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="w-full rounded-[2rem] overflow-hidden bg-transparent px-0">
              <div className="bg-white dark:bg-slate-800/85 border border-slate-200/80 dark:border-slate-700/60 rounded-[2rem] overflow-hidden shadow-[0_20px_70px_-30px_rgba(15,23,42,0.35)] transition-colors">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleSection("locations")}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      toggleSection("locations");
                    }
                  }}
                  className="w-full p-4 md:p-5 flex items-center justify-between transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/60 relative group cursor-pointer outline-none focus-visible:ring-4 focus-visible:ring-brand-blue/10"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-3xl bg-brand-red/10 dark:bg-brand-red/15 flex items-center justify-center text-brand-red group-hover:bg-brand-red/15 transition-colors"><MapPin className="w-6 h-6" /></div>
                    <div className="flex flex-col items-start"><span className="font-bold text-[16px] text-slate-900 dark:text-white">{currentT.locationsTitle}</span><span className="text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-[0.24em] mt-1">{ALL_BRANCHES.length} {currentT.locationsCount}</span></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center gap-1 bg-slate-50/60 dark:bg-slate-800/60 p-1 rounded-lg border border-slate-100 dark:border-slate-700/50">
                      <button onClick={(e) => { e.stopPropagation(); setMapSource("google"); }} className={`px-3 py-1 text-sm rounded-md font-semibold ${mapSource === "google" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400"}`}>
                        Google
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setMapSource("leaflet"); }} className={`px-3 py-1 text-sm rounded-md font-semibold ${mapSource === "leaflet" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400"}`}>
                        Local
                      </button>
                    </div>
                    <motion.div animate={{ rotate: openSection === "locations" ? 180 : 0 }} className="w-11 h-11 rounded-full bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center border border-slate-100 dark:border-slate-700/60 transition-colors"><ChevronDown className="w-5 h-5 text-slate-400 dark:text-slate-300" /></motion.div>
                  </div>
                </div>

                <AnimatePresence>
                  {openSection === "locations" && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="p-5 pt-0 border-t border-slate-200 dark:border-slate-700/60 bg-slate-50/40 dark:bg-slate-900/40 transition-colors">
                            <div className="rounded-[2rem] bg-gradient-to-br from-brand-blue/10 via-slate-100 to-brand-red/10 dark:from-brand-blue/10 dark:via-slate-900/70 dark:to-brand-red/15 border border-slate-200/80 dark:border-slate-700/50 p-4 mb-5 shadow-[0_16px_35px_-18px_rgba(30,41,59,0.35)]">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue dark:text-[#7dd3fc]">{currentT.routesTitle}</div>
                                <div className="mt-2 text-xl font-bold text-slate-900 dark:text-white">{currentT.findNearestBranch}</div>
                              </div>
                              <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-[0.2em] rounded-2xl bg-brand-red/10 text-brand-red dark:bg-brand-red/15 dark:text-[#ff8fa1] shadow-sm">{ALL_BRANCHES.length} {currentT.branchesCountWord}</div>
                            </div>
                            <div className="flex items-center justify-between gap-3 pt-2">
                              <button onClick={handleNearby} disabled={geoLoading} className="inline-flex items-center gap-2 rounded-full bg-brand-blue text-white px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] shadow-[0_12px_25px_-12px_rgba(37,99,235,0.8)] disabled:opacity-70 transition-transform hover:-translate-y-0.5">
                                {geoLoading ? <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <MapPin className="w-3.5 h-3.5" />}
                                {currentT.findNearby}
                                {nearbyCount !== null && <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">{nearbyCount}</span>}
                              </button>
                              {geoError && <span className="text-[11px] text-red-600 dark:text-red-400">{geoError}</span>}
                            </div>

                            {nearestBranch && userLocation && (
                              <div className="mt-3 rounded-[1.25rem] border border-amber-200 bg-amber-50/80 p-3 text-[12px] text-slate-700 shadow-sm dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-100">
                                <span className="font-bold">Ближайший:</span> {nearestBranch.name} · {formatDistanceKm(haversine(userLocation.lat, userLocation.lng, nearestBranch.coords[0], nearestBranch.coords[1]))}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="w-full h-[380px] md:h-[430px] bg-[#f8fafc] dark:bg-slate-900 rounded-[2rem] md:rounded-[2.25rem] overflow-hidden mb-5 shadow-[0_14px_40px_-18px_rgba(15,23,42,0.3)] border border-slate-200 dark:border-slate-700 relative z-0 ring-1 ring-slate-200/60 dark:ring-slate-700/50">
                          {mapSource === "google" ? (
                            <div className="relative w-full h-full overflow-hidden bg-[#f8fafc]">
                              <div className="absolute inset-x-0 top-0 h-[64px] z-10 bg-[#f8fafc] dark:bg-slate-900 pointer-events-none" />
                              <iframe
                                src="https://www.google.com/maps/d/embed?mid=1P6pKsM1AWWytKQ0WkGa5Jlr2iUx8g4A"
                                width="100%"
                                height="115%"
                                style={{
                                  border: 0,
                                  display: "block",
                                  position: "absolute",
                                  left: 0,
                                  top: "-64px",
                                  width: "100%",
                                  height: "calc(100% + 64px)",
                                  background: "#f8fafc",
                                  filter: "saturate(0.95) contrast(1.04)",
                                }}
                                loading="lazy"
                                title="Akmal Farm locations"
                              />
                            </div>
                          ) : (
                            <div ref={mapContainerRef} className="w-full h-full overflow-hidden rounded-[2rem]" />
                          )}
                        </div>

                        <div className="mb-4 relative group/search">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within/search:text-brand-blue transition-colors"><Search className="w-4 h-4" /></div>
                          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={currentT.searchPlaceholder} className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800/55 border border-slate-200 dark:border-slate-700/60 rounded-[1.75rem] text-[13px] font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-blue/50 focus:ring-4 focus:ring-brand-blue/10 dark:focus:ring-brand-blue/20 transition-all shadow-sm" />
                        </div>

                        <div className="space-y-3 max-h-[340px] overflow-y-auto pr-2 custom-scrollbar">
                          {filteredBranches.length > 0 ? (
                            filteredBranches.map((branch, index) => {
                              const distanceKm = userLocation ? haversine(userLocation.lat, userLocation.lng, branch.coords[0], branch.coords[1]) : null;
                              const isNearest = nearestBranch ? branch.name === nearestBranch.name && branch.address === nearestBranch.address : false;

                              return (
                                <div key={`${branch.name}-${index}`} onClick={() => { if (mapSource === "leaflet" && mapRef.current) { mapRef.current.setView(branch.coords, 12, { animate: true, duration: 1.2 }); } }} className={`cursor-pointer rounded-[1.35rem] border p-3.5 shadow-sm transition-all duration-200 ease-out ${isNearest ? "border-amber-300 bg-amber-50/80 shadow-[0_12px_25px_-18px_rgba(245,158,11,0.8)] dark:border-amber-800 dark:bg-amber-900/20" : "border-slate-200/80 bg-white dark:border-slate-700/60 dark:bg-slate-800/70 hover:shadow-md hover:-translate-y-0.5"}`}>
                                  <div className="flex items-start gap-3">
                                    <div className={`mt-1 flex-shrink-0 w-3 h-3 rounded-full ${branch.type === "Apteka 24/7" ? "bg-red-500 ring-4 ring-red-100 dark:ring-red-900/40" : "bg-blue-500 ring-4 ring-blue-100 dark:ring-blue-900/40"}`} />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between gap-2">
                                        <div className="font-bold text-[14px] text-slate-800 dark:text-white truncate">{branch.name}</div>
                                        <span className={`text-[9px] font-bold uppercase tracking-wider rounded-full px-2 py-1 ${branch.type === "Apteka 24/7" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"}`}>
                                          {branch.type === "Apteka 24/7" ? "24/7" : "Apteka"}
                                        </span>
                                      </div>
                                      <div className="mt-1 text-[12px] text-slate-500 dark:text-slate-300 leading-5">{branch.address}</div>
                                      {distanceKm !== null && (
                                        <div className="mt-2 flex items-center gap-2 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                                          <MapPin className="w-3.5 h-3.5" />
                                          <span>{formatDistanceKm(distanceKm)} от вас</span>
                                        </div>
                                      )}
                                      <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400"><Clock className="w-3.5 h-3.5" /><span>{branch.hours}</span></div>
                                      <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400"><Phone className="w-3.5 h-3.5" /><span>{branch.phone}</span></div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white/60 dark:bg-slate-800/60 p-5 text-center text-sm text-slate-500 dark:text-slate-400">{currentT.nothingFound}</div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
