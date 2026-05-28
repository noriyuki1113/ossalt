import { Lock } from "lucide-react";

interface Props {
  /** ドメイン例（例: app.example.com） */
  domain: string;
  /** 内部で起動しているサービスのhost:port（例: app:3000） */
  upstream: string;
  /** 追加の補足説明（任意） */
  note?: string;
}

/**
 * Caddyを使った自動HTTPS化セクション。
 * 各セルフホストガイドで再利用する。
 */
export function HttpsCaddySection({ domain, upstream, note }: Props) {
  const caddyfile = `${domain} {
  reverse_proxy ${upstream}
}`;

  const compose = `services:
  caddy:
    image: caddy:2
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config

volumes:
  caddy_data:
  caddy_config:`;

  return (
    <section className="container pb-10">
      <div className="card-unified p-6 md:p-8 max-w-3xl">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Lock className="h-4 w-4 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">HTTPS化（Caddyで自動取得）</h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Caddyを使うと、Let's Encryptの証明書取得・更新を自動で行えます。Nginxより設定がシンプルで、初心者向きです。事前にドメインのAレコードをVPSのIPアドレスに向けておいてください。
        </p>

        <div className="space-y-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Caddyfile</p>
            <div className="card-unified overflow-hidden">
              <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-foreground bg-secondary/30">
                <code>{caddyfile}</code>
              </pre>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">docker-compose.yml にCaddyを追加</p>
            <div className="card-unified overflow-hidden">
              <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-foreground bg-secondary/30">
                <code>{compose}</code>
              </pre>
            </div>
          </div>
        </div>

        <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground list-disc pl-5">
          <li>ポート80と443をVPSのファイアウォールで開放してください。</li>
          <li>本体サービスは <code className="text-foreground">expose</code> のみにし、外部に直接ポートを公開しないのが安全です。</li>
          <li>Caddyfileとサービスを同じDocker network内に置く必要があります。</li>
        </ul>

        {note ? (
          <p className="mt-4 text-xs text-muted-foreground leading-relaxed border-t border-border pt-3">{note}</p>
        ) : null}
      </div>
    </section>
  );
}
