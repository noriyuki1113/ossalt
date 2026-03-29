import { Link } from "react-router-dom";
import { ExternalLink, Github, Star, GitFork, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductLogo } from "@/components/ProductLogo";

interface ProductHeroProps {
  product: any;
  relatedAlts: any[];
}

export function ProductHero({ product, relatedAlts }: ProductHeroProps) {
  const name = product.name;
  const jpName = product.japanese_name;
  const formatStars = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
  const formatDate = (d: string) => {
    const date = new Date(d);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 1) return "今日";
    if (diffDays < 30) return `${diffDays}日前`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}ヶ月前`;
    return `${Math.floor(diffDays / 365)}年前`;
  };

  return (
    <section className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
      <ProductLogo
        name={name}
        logoUrl={product.logo_url}
        logoGithubReadmeUrl={product.logo_github_readme_url}
        logoGithubAvatarUrl={product.logo_github_avatar_url}
        logoFaviconUrl={product.logo_favicon_url}
        websiteUrl={product.website_url}
        githubUrl={product.github_url}
        size="xl"
      />

      <div className="flex-1 min-w-0">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
          {name}
        </h1>
        {jpName && jpName !== name && (
          <p className="text-lg text-muted-foreground mt-0.5">{jpName}</p>
        )}
        <p className="mt-2 text-lg text-muted-foreground leading-relaxed max-w-2xl">
          {product.short_description}
        </p>

        {/* Alternative source badges */}
        {relatedAlts.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {relatedAlts.map((alt: any) => (
              <Link key={alt.source_slug} to={`/alternatives/${alt.source_slug}`}>
                <Badge variant="outline" className="hover:bg-primary/5 transition-colors text-xs">
                  {alt.source_name}の代替
                </Badge>
              </Link>
            ))}
          </div>
        )}

        {/* Feature badges */}
        <div className="mt-4 flex flex-wrap gap-2">
          {product.is_open_source && (
            <Badge className="bg-accent/10 text-accent border-accent/20 hover:bg-accent/15">OSS</Badge>
          )}
          {product.is_self_hostable && (
            <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/15">セルフホスト</Badge>
          )}
          {product.has_cloud && (
            <Badge className="bg-secondary text-secondary-foreground">クラウド</Badge>
          )}
          {product.supports_japanese && (
            <Badge className="bg-accent/10 text-accent border-accent/20">🇯🇵 日本語対応</Badge>
          )}
        </div>

        {/* CTAs */}
        <div className="mt-6 flex flex-wrap gap-3">
          {product.website_url && (
            <a href={product.website_url} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="rounded-xl shadow-sm">
                <ExternalLink className="mr-2 h-4 w-4" />公式サイトを見る
              </Button>
            </a>
          )}
          {product.github_url && (
            <a href={product.github_url} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg" className="rounded-xl">
                <Github className="mr-2 h-4 w-4" />GitHubを見る
              </Button>
            </a>
          )}
        </div>

        {/* GitHub metrics */}
        {product.github_url && (
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {(product.github_stars ?? 0) > 0 && (
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                <span className="font-medium text-foreground">{formatStars(product.github_stars)}</span> Stars
              </span>
            )}
            {(product.github_forks ?? 0) > 0 && (
              <span className="flex items-center gap-1.5">
                <GitFork className="h-4 w-4" />
                <span className="font-medium text-foreground">{formatStars(product.github_forks)}</span> Forks
              </span>
            )}
            {product.last_commit_at && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />最終コミット: {formatDate(product.last_commit_at)}
              </span>
            )}
            {product.license && (
              <span className="flex items-center gap-1.5">
                <Shield className="h-4 w-4" />{product.license}
              </span>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
