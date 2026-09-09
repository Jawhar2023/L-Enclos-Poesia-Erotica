export type SqlGroup = "likes" | "comments" | "submissions" | "poems" | "config";

export type SqlRecipe = {
  id: string;
  group: SqlGroup;
  labelFr: string;
  labelAr: string;
  hintFr: string;
  hintAr: string;
  sql: string;
  write?: boolean;
};

export const SQL_TABLES = ["poems", "comments", "reactions", "submissions"] as const;

export const TABLE_PRESETS: Record<(typeof SQL_TABLES)[number], string> = {
  poems: `select id, title_fr, author_fr, featured, created_at
from poems
order by created_at desc;`,
  comments: `select c.created_at, c.author, c.body, p.title_fr as poem, c.poem_id, c.id
from comments c
left join poems p on p.id = c.poem_id
order by c.created_at desc
limit 50;`,
  reactions: `select r.created_at, p.title_fr as poem, r.visitor_id, r.poem_id, r.id
from reactions r
left join poems p on p.id = r.poem_id
order by r.created_at desc
limit 50;`,
  submissions: `select created_at, status, author, title_fr, title_ar, id
from submissions
order by created_at desc;`,
};

export const SQL_RECIPES: SqlRecipe[] = [
  {
    id: "likes-recent",
    group: "likes",
    labelFr: "Derniers j'aime",
    labelAr: "آخر الإعجابات",
    hintFr: "Chaque cœur cliqué sur une page de poème.",
    hintAr: "كل قلب نُقر على صفحة قصيدة.",
    sql: TABLE_PRESETS.reactions,
  },
  {
    id: "likes-by-poem",
    group: "likes",
    labelFr: "J'aime par poème",
    labelAr: "الإعجابات حسب القصيدة",
    hintFr: "Classement des poèmes les plus aimés.",
    hintAr: "ترتيب القصائد الأكثر إعجاباً.",
    sql: `select p.id, p.title_fr, p.title_ar, count(r.id) as likes
from poems p
left join reactions r on r.poem_id = p.id
group by p.id, p.title_fr, p.title_ar
order by likes desc, p.title_fr;`,
  },
  {
    id: "likes-visitors",
    group: "likes",
    labelFr: "Visiteurs qui aiment",
    labelAr: "الزوار المعجبون",
    hintFr: "Combien de cœurs par visiteur.",
    hintAr: "كم قلباً لكل زائر.",
    sql: `select visitor_id, count(*) as likes, min(created_at) as first_like, max(created_at) as last_like
from reactions
group by visitor_id
order by likes desc;`,
  },
  {
    id: "comments-recent",
    group: "comments",
    labelFr: "Derniers commentaires",
    labelAr: "آخر التعليقات",
    hintFr: "Ce que les lecteurs viennent d'écrire.",
    hintAr: "ما كتبه القرّاء للتو.",
    sql: TABLE_PRESETS.comments,
  },
  {
    id: "comments-by-poem",
    group: "comments",
    labelFr: "Commentaires par poème",
    labelAr: "التعليقات حسب القصيدة",
    hintFr: "Volume de la conversation sous chaque texte.",
    hintAr: "حجم الحوار تحت كل نص.",
    sql: `select p.id, p.title_fr, count(c.id) as comments, max(c.created_at) as last_comment
from poems p
left join comments c on c.poem_id = p.id
group by p.id, p.title_fr
order by comments desc, p.title_fr;`,
  },
  {
    id: "comments-anonymous",
    group: "comments",
    labelFr: "Commentaires anonymes",
    labelAr: "تعليقات مجهولة",
    hintFr: "Traces laissées sans nom.",
    hintAr: "أثر بلا اسم.",
    sql: `select created_at, body, poem_id, id
from comments
where trim(author) = ''
order by created_at desc;`,
  },
  {
    id: "subs-pending",
    group: "submissions",
    labelFr: "Soumissions en attente",
    labelAr: "المشاركات قيد الانتظار",
    hintFr: "Poèmes envoyés depuis /soumettre, pas encore lus.",
    hintAr: "قصائد أُرسلت من /soumettre ولم تُقرأ بعد.",
    sql: `select created_at, author, title_fr, title_ar, id, left(body_fr, 180) as excerpt
from submissions
where status = 'pending'
order by created_at desc;`,
  },
  {
    id: "subs-all",
    group: "submissions",
    labelFr: "Toutes les soumissions",
    labelAr: "كل المشاركات",
    hintFr: "pending, approved, rejected.",
    hintAr: "قيد الانتظار، مقبول، مرفوض.",
    sql: `select created_at, status, author, title_fr, title_ar, id
from submissions
order by created_at desc;`,
  },
  {
    id: "subs-approved",
    group: "submissions",
    labelFr: "Poèmes acceptés",
    labelAr: "القصائد المقبولة",
    hintFr: "Voix du salon déjà admises.",
    hintAr: "أصوات الصالون التي قُبلت.",
    sql: `select created_at, author, title_fr, title_ar, id
from submissions
where status = 'approved'
order by created_at desc;`,
  },
  {
    id: "poems-library",
    group: "poems",
    labelFr: "Bibliothèque + cœurs + voix",
    labelAr: "المكتبة + القلوب + الأصوات",
    hintFr: "Vue admin : poème, likes, commentaires.",
    hintAr: "عرض الإدارة: القصيدة والإعجابات والتعليقات.",
    sql: `select p.id,
       p.title_fr,
       p.author_fr,
       p.featured,
       (select count(*) from reactions r where r.poem_id = p.id) as likes,
       (select count(*) from comments c where c.poem_id = p.id) as comments,
       p.created_at
from poems p
order by p.created_at desc;`,
  },
  {
    id: "poems-featured",
    group: "poems",
    labelFr: "Poèmes à l'honneur",
    labelAr: "القصائد البارزة",
    hintFr: "Ceux marqués featured sur l'accueil.",
    hintAr: "المعلَّمة featured في الصفحة الرئيسة.",
    sql: `select id, title_fr, title_ar, author_fr, featured, created_at
from poems
where featured = true
order by created_at;`,
  },
  {
    id: "poems-missing-ar",
    group: "poems",
    labelFr: "Sans texte arabe",
    labelAr: "بلا نص عربي",
    hintFr: "Traductions encore vides.",
    hintAr: "ترجمات ما زالت فارغة.",
    sql: `select id, title_fr, author_fr, length(body_fr) as fr_len, length(body_ar) as ar_len
from poems
where trim(coalesce(body_ar, '')) = ''
order by title_fr;`,
  },
  {
    id: "config-dashboard",
    group: "config",
    labelFr: "Tableau de bord",
    labelAr: "لوحة التحكم",
    hintFr: "Les mêmes chiffres que les cartes admin.",
    hintAr: "نفس أرقام بطاقات الإدارة.",
    sql: `select
  (select count(*) from poems) as poems,
  (select count(*) from reactions) as likes,
  (select count(*) from comments) as comments,
  (select count(*) from submissions) as submissions,
  (select count(*) from submissions where status = 'pending') as pending,
  (select count(*) from submissions where status = 'approved') as approved,
  (select count(*) from submissions where status = 'rejected') as rejected;`,
  },
  {
    id: "config-schema",
    group: "config",
    labelFr: "Schéma des tables",
    labelAr: "مخطط الجداول",
    hintFr: "Colonnes PostgreSQL du salon.",
    hintAr: "أعمدة PostgreSQL للصالون.",
    sql: `select table_name, column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'public'
  and table_name in ('poems', 'comments', 'reactions', 'submissions')
order by table_name, ordinal_position;`,
  },
  {
    id: "config-policies",
    group: "config",
    labelFr: "Politiques RLS",
    labelAr: "سياسات RLS",
    hintFr: "Qui peut lire, écrire, supprimer.",
    hintAr: "من يقرأ ويكتب ويحذف.",
    sql: `select schemaname, tablename, policyname, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
order by tablename, policyname;`,
  },
  {
    id: "config-indexes",
    group: "config",
    labelFr: "Index",
    labelAr: "الفهارس",
    hintFr: "Accélération des likes, commentaires, soumissions.",
    hintAr: "تسريع الإعجابات والتعليقات والمشاركات.",
    sql: `select tablename, indexname, indexdef
from pg_indexes
where schemaname = 'public'
  and tablename in ('poems', 'comments', 'reactions', 'submissions')
order by tablename, indexname;`,
  },
];

export const SQL_GROUPS: { id: SqlGroup; labelFr: string; labelAr: string }[] = [
  { id: "likes", labelFr: "J'aime", labelAr: "إعجاب" },
  { id: "comments", labelFr: "Commentaires", labelAr: "تعليقات" },
  { id: "submissions", labelFr: "Soumettre", labelAr: "أرسل قصيدة" },
  { id: "poems", labelFr: "Poèmes", labelAr: "قصائد" },
  { id: "config", labelFr: "Configuration", labelAr: "إعداد" },
];

export function isWriteSql(sql: string) {
  const trimmed = sql.trim().replace(/--.*$/gm, "").trim();
  return /^(insert|update|delete|drop|alter|truncate|create|grant|revoke|comment|vacuum|reindex)\b/i.test(
    trimmed,
  );
}

export const SCHEMA_SQL = `select table_name, column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public'
  and table_name in ('poems', 'comments', 'reactions', 'submissions')
order by table_name, ordinal_position;`;
