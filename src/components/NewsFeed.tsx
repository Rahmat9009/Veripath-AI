import React, { useEffect, useMemo, useState } from 'react';
import { NewsArticle, Language, NewsCategory } from '../types';
import { INITIAL_NEWS_ARTICLES } from '../data/mockData';
import {
  Bookmark,
  BookmarkCheck,
  Check,
  ExternalLink,
  Newspaper,
  RefreshCw,
  Search,
  Share2,
  ThumbsUp,
  X,
} from 'lucide-react';
import { useT } from '../i18n/strings';
import { apiFetch } from '../lib/api';
import { cn } from '../lib/cn';
import {
  Button,
  Callout,
  EmptyState,
  Field,
  LinkButton,
  Modal,
  PageHeader,
  StateBlock,
  Tabs,
  controlClass,
} from './ui';

interface NewsFeedProps {
  lang: Language;
}

/**
 * IDs of the articles that ship with the app. Anything in this set is
 * demonstration content and is labelled as such — it was never fetched from a
 * source, so it may not carry a source badge.
 */
const DEMO_IDS = new Set(INITIAL_NEWS_ARTICLES.map((a) => a.id));

type Strings = ReturnType<typeof useT>;

/**
 * Provenance badge. Items bundled with the app may never claim a source —
 * only fetched items carry one.
 */
const Provenance: React.FC<{ article: NewsArticle; t: Strings }> = ({ article, t }) =>
  DEMO_IDS.has(article.id) ? (
    <span className="inline-flex items-center rounded-full border border-unknown/45 bg-unknown-surface px-2.5 py-1 font-mono text-label uppercase tracking-[0.06em] text-unknown hatch">
      {t.news.demoBadge}
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full border border-rule bg-paper px-2.5 py-1 font-mono text-label uppercase tracking-[0.06em] text-ink-muted">
      {article.sourceType}
    </span>
  );

interface ArticleCardProps {
  article: NewsArticle;
  t: Strings;
  featured?: boolean;
  bookmarked: boolean;
  liked: boolean;
  likes: number;
  copied: boolean;
  onOpen: (article: NewsArticle) => void;
  onBookmark: (id: string, event?: React.MouseEvent) => void;
  onLike: (id: string, event?: React.MouseEvent) => void;
  onShare: (article: NewsArticle, event?: React.MouseEvent) => void;
}

/**
 * Defined at module scope on purpose: as a nested component it was a new type
 * on every render, so React remounted every card whenever a filter changed —
 * which also destroyed the button that opened the dialog, breaking focus
 * return on close.
 */
const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  t,
  featured,
  bookmarked,
  liked,
  likes,
  copied,
  onOpen,
  onBookmark,
  onLike,
  onShare,
}) => {
  const isDemo = DEMO_IDS.has(article.id);

  return (
    <article
      className={cn(
        'flex flex-col overflow-hidden rounded-record border border-rule bg-surface',
        featured && 'lg:grid lg:grid-cols-2 lg:items-stretch'
      )}
    >
      <div className={cn('relative bg-paper', featured ? 'aspect-video lg:aspect-auto' : 'aspect-video')}>
        <img
          src={article.imageUrl}
          alt=""
          loading="lazy"
          className={cn('h-full w-full object-cover', isDemo && 'opacity-90')}
        />
        <div className="absolute left-3 top-3">
          <Provenance article={article} t={t} />
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-4 p-5">
        <div className="space-y-2">
          <p className="font-mono text-label uppercase tracking-[0.08em] text-ink-faint">
            {article.category} · {article.country}
          </p>

          <h3 className={cn('font-serif text-ink', featured ? 'text-display-m' : 'text-title')}>
            <button
              type="button"
              onClick={() => onOpen(article)}
              className="text-left underline-offset-4 hover:underline"
            >
              {article.title}
            </button>
          </h3>

          <p className="text-body-s text-ink-muted">{article.summary}</p>

          <p className="font-mono text-label text-ink-faint">
            {t.news.sourceLabel}: {article.sourceName} · {article.timeAgo} · {article.readTime}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-rule pt-3">
          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={(e) => onLike(article.id, e)}
              aria-pressed={liked}
              className={cn(
                'inline-flex min-h-[2.75rem] items-center gap-1.5 rounded-control px-2.5 text-body-s transition-colors',
                liked ? 'text-navy' : 'text-ink-muted hover:text-ink'
              )}
            >
              <ThumbsUp className={cn('h-4 w-4', liked && 'fill-navy-tint')} aria-hidden="true" />
              <span className="tabular">{likes}</span>
              <span className="sr-only">{t.news.like}</span>
            </button>

            <button
              type="button"
              onClick={(e) => onBookmark(article.id, e)}
              aria-pressed={bookmarked}
              className={cn(
                'inline-flex min-h-[2.75rem] items-center gap-1.5 rounded-control px-2.5 text-body-s transition-colors',
                bookmarked ? 'text-navy' : 'text-ink-muted hover:text-ink'
              )}
            >
              {bookmarked ? (
                <BookmarkCheck className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Bookmark className="h-4 w-4" aria-hidden="true" />
              )}
              <span>{bookmarked ? t.news.saved : t.news.save}</span>
            </button>

            <button
              type="button"
              onClick={(e) => onShare(article, e)}
              className="inline-flex min-h-[2.75rem] items-center gap-1.5 rounded-control px-2.5 text-body-s text-ink-muted transition-colors hover:text-ink"
            >
              {copied ? (
                <Check className="h-4 w-4 text-verified" aria-hidden="true" />
              ) : (
                <Share2 className="h-4 w-4" aria-hidden="true" />
              )}
              <span>{copied ? t.common.copied : t.news.share}</span>
            </button>
          </div>

          <a
            href={article.officialLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex min-h-[2.75rem] items-center gap-1.5 text-body-s font-medium text-navy underline underline-offset-2"
          >
            <span>{t.news.openOriginal}</span>
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
};

export const NewsFeed: React.FC<NewsFeedProps> = ({ lang }) => {
  const t = useT(lang);

  const [articles, setArticles] = useState<NewsArticle[]>(INITIAL_NEWS_ARTICLES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | 'Bookmarked'>('All');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedUnavailable, setFeedUnavailable] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('veripath_saved_articles');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [likedIds, setLikedIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem('veripath_saved_articles', JSON.stringify(bookmarkedIds));
    } catch {
      /* storage unavailable — bookmarks still work for this visit */
    }
  }, [bookmarkedIds]);

  const fetchLiveNews = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/news-feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory === 'Bookmarked' ? 'All' : selectedCategory,
          country: selectedRegion,
          searchQuery: searchQuery || activeTag || '',
        }),
      });

      if (!res.ok) throw new Error('Feed request failed');

      const data = await res.json();
      const fetched: NewsArticle[] = Array.isArray(data.articles) ? data.articles : [];

      if (fetched.length === 0) {
        // The service answers with an empty list when it is offline. Saying
        // nothing here would leave demo items looking like live news.
        setFeedUnavailable(true);
      } else {
        setFeedUnavailable(false);
        setArticles((prev) => {
          const existing = new Set(prev.map((a) => a.id));
          return [...fetched.filter((a) => !existing.has(a.id)), ...prev];
        });
        setLastUpdated(data.lastUpdated || new Date().toLocaleTimeString());
      }
    } catch {
      setFeedUnavailable(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveNews();
    const timer = setInterval(fetchLiveNews, 300000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, selectedRegion]);

  const toggleBookmark = (id: string, event?: React.MouseEvent) => {
    event?.stopPropagation();
    setBookmarkedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleLike = (id: string, event?: React.MouseEvent) => {
    event?.stopPropagation();
    setLikedIds((prev) => {
      const liked = prev.includes(id);
      setLikeCounts((counts) => {
        const base = counts[id] ?? articles.find((a) => a.id === id)?.likesCount ?? 0;
        return { ...counts, [id]: liked ? Math.max(0, base - 1) : base + 1 };
      });
      return liked ? prev.filter((x) => x !== id) : [...prev, id];
    });
  };

  const share = (article: NewsArticle, event?: React.MouseEvent) => {
    event?.stopPropagation();
    const url = article.officialLink || window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${article.title}\n${url}`);
      setCopiedId(article.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const categories: Array<{ id: NewsCategory | 'Bookmarked'; label: string }> = [
    { id: 'All', label: t.news.catAll },
    { id: 'Jobs & Career', label: t.news.catJobs },
    { id: 'Study & Admissions', label: t.news.catStudy },
    { id: 'Business & Trade', label: t.news.catBusiness },
    { id: 'Visa & Immigration', label: t.news.catVisa },
    { id: 'Government & Laws', label: t.news.catGov },
    { id: 'Future & Planning', label: t.news.catFuture },
    { id: 'Bookmarked', label: t.news.catSaved },
  ];

  const regions = [
    { id: 'All', label: t.news.regionAll },
    { id: 'UK & Europe', label: t.news.regionEurope },
    { id: 'Middle East', label: t.news.regionMiddleEast },
    { id: 'North America', label: t.news.regionAmerica },
    { id: 'Asia Pacific', label: t.news.regionAsia },
  ];

  const trendingTags = [
    { tag: '#DecretoFlussi2026', label: 'Italy Flussi' },
    { tag: '#UKSkilledWorker', label: 'UK work visa' },
    { tag: '#GlobalStudy2026', label: 'STEM scholarships' },
    { tag: '#GulfBusinessSetup', label: 'Qatar & KSA CR' },
    { tag: '#WageProtectionLaw', label: 'Zero-fee rules' },
    { tag: '#FutureSkills2030', label: 'ILO 2030 roadmap' },
    { tag: '#CanadaExpressEntry', label: 'Canada Express Entry' },
  ];

  const countFor = (id: string) => {
    if (id === 'All') return articles.length;
    if (id === 'Bookmarked') return bookmarkedIds.length;
    return articles.filter((a) => a.category === id).length;
  };

  const filtered = useMemo(
    () =>
      articles.filter((article) => {
        if (selectedCategory === 'Bookmarked') {
          if (!bookmarkedIds.includes(article.id)) return false;
        } else if (selectedCategory !== 'All' && article.category !== selectedCategory) {
          return false;
        }
        if (selectedRegion !== 'All' && article.region !== selectedRegion) return false;
        if (activeTag && article.trendingTag !== activeTag) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const haystack = [article.title, article.summary, article.sourceName, article.country]
            .join(' ')
            .toLowerCase();
          if (!haystack.includes(q)) return false;
        }
        return true;
      }),
    [articles, selectedCategory, selectedRegion, activeTag, searchQuery, bookmarkedIds]
  );

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedRegion('All');
    setActiveTag(null);
  };

  const [featured, ...rest] = filtered;

  const cardProps = (article: NewsArticle) => ({
    article,
    t,
    bookmarked: bookmarkedIds.includes(article.id),
    liked: likedIds.includes(article.id),
    likes: likeCounts[article.id] ?? article.likesCount,
    copied: copiedId === article.id,
    onOpen: setSelectedArticle,
    onBookmark: toggleBookmark,
    onLike: toggleLike,
    onShare: share,
  });

  return (
    <div className="space-y-8 pb-8">
      <PageHeader lang={lang} kicker={t.news.kicker} title={t.news.title} intro={t.news.intro}>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-12">
            <Field label={t.news.searchLabel} className="sm:col-span-7">
              {(props) => (
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
                    aria-hidden="true"
                  />
                  <input
                    {...props}
                    type="search"
                    className={cn(controlClass, 'pl-9')}
                    placeholder={t.news.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (activeTag) setActiveTag(null);
                    }}
                  />
                </div>
              )}
            </Field>

            <Field label={t.news.regionLabel} className="sm:col-span-5">
              {(props) => (
                <select
                  {...props}
                  className={controlClass}
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                >
                  {regions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.label}
                    </option>
                  ))}
                </select>
              )}
            </Field>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-label uppercase tracking-[0.08em] text-ink-faint">
              {t.news.trendingLabel}
            </span>
            {trendingTags.map((item) => (
              <button
                key={item.tag}
                type="button"
                aria-pressed={activeTag === item.tag}
                onClick={() => {
                  setActiveTag((prev) => (prev === item.tag ? null : item.tag));
                  setSearchQuery('');
                }}
                className={cn(
                  'min-h-[2.75rem] rounded-full border px-3.5 text-body-s transition-colors',
                  activeTag === item.tag
                    ? 'border-navy bg-navy text-white'
                    : 'border-rule bg-surface text-ink-muted hover:border-navy/50 hover:text-ink'
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-4">
            <p className="font-mono text-label uppercase tracking-[0.08em] text-ink-faint">
              {t.news.updated}: {lastUpdated || t.news.lastUpdatedNever}
            </p>
            <Button variant="secondary" size="sm" onClick={fetchLiveNews} disabled={loading}>
              <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} aria-hidden="true" />
              <span>{loading ? t.news.refreshing : t.news.refresh}</span>
            </Button>
          </div>
        </div>
      </PageHeader>

      {feedUnavailable ? (
        <StateBlock
          lang={lang}
          status="backend-unavailable"
          title={t.states.backendUnavailableTitle}
          body={t.news.offlineNotice}
          icon={Newspaper}
        />
      ) : (
        <Callout tone="neutral">{t.news.liveNotice}</Callout>
      )}

      <Callout tone="unknown">{t.news.demoNotice}</Callout>

      <Tabs
        variant="pill"
        label={t.news.categoryLabel}
        value={selectedCategory}
        onChange={setSelectedCategory}
        items={categories.map((category) => ({
          id: category.id,
          label: `${category.label} (${countFor(category.id)})`,
        }))}
      />

      {filtered.length === 0 ? (
        <EmptyState
          lang={lang}
          icon={Newspaper}
          title={t.news.emptyTitle}
          body={t.news.emptyBody}
          action={
            <Button variant="secondary" onClick={resetFilters}>
              {t.news.clearFilters}
            </Button>
          }
        />
      ) : (
        <div className="space-y-6">
          {featured && <ArticleCard {...cardProps(featured)} featured />}
          {rest.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((article) => (
                <ArticleCard key={article.id} {...cardProps(article)} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Full article ------------------------------------------------------ */}
      <Modal
        open={Boolean(selectedArticle)}
        onClose={() => setSelectedArticle(null)}
        title={selectedArticle?.title || t.news.articleLabel}
        closeLabel={t.common.close}
      >
        {selectedArticle && (
          <div className="space-y-5 px-5 py-5 sm:px-6">
            <div className="flex flex-wrap items-center gap-2">
              <Provenance article={selectedArticle} t={t} />
              <span className="font-mono text-label uppercase tracking-[0.08em] text-ink-faint">
                {selectedArticle.category} · {selectedArticle.country} · {selectedArticle.publishDate}
              </span>
            </div>

            <img
              src={selectedArticle.imageUrl}
              alt=""
              className="max-h-64 w-full rounded-control object-cover"
            />

            <div className="rounded-control border border-rule bg-paper p-4">
              <p className="font-mono text-label uppercase tracking-[0.08em] text-ink-faint">
                {t.news.summaryLabel}
              </p>
              <p className="mt-1.5 text-body text-ink">{selectedArticle.summary}</p>
            </div>

            <div className="space-y-3 text-body text-ink-muted">
              {selectedArticle.fullContent.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-4">
              <p className="font-mono text-label text-ink-faint">
                {t.news.sourceLabel}: {selectedArticle.sourceName} ({selectedArticle.sourceDomain})
              </p>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" size="sm" onClick={() => toggleBookmark(selectedArticle.id)}>
                  {bookmarkedIds.includes(selectedArticle.id) ? (
                    <BookmarkCheck className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Bookmark className="h-4 w-4" aria-hidden="true" />
                  )}
                  <span>{bookmarkedIds.includes(selectedArticle.id) ? t.news.saved : t.news.save}</span>
                </Button>
                <LinkButton
                  href={selectedArticle.officialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  size="sm"
                >
                  <span>{t.news.openOriginal}</span>
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </LinkButton>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Screen-reader confirmation for copy actions */}
      <p aria-live="polite" className="sr-only">
        {copiedId ? t.common.copied : ''}
      </p>
    </div>
  );
};
