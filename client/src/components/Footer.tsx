import { Github, Instagram, Linkedin, Mail, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <p className="text-xs text-muted-foreground">
            © 2025 Developed by{" "}
            <span className="font-semibold text-primary" style={{ textShadow: "0 0 10px rgba(6, 182, 212, 0.3)" }}>
              Arideep Kanshabanik
            </span>
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/ArideepCodes"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
              style={{ textShadow: "0 0 8px rgba(6, 182, 212, 0.2)" }}
              data-testid="link-github"
            >
              <Github className="h-3.5 w-3.5" />
              <span className="group-hover:underline">GitHub</span>
              <ExternalLink className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <a
              href="https://www.instagram.com/greenflaghunyaar"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors"
              style={{ textShadow: "0 0 8px rgba(168, 85, 247, 0.2)" }}
              data-testid="link-instagram"
            >
              <Instagram className="h-3.5 w-3.5" />
              <span className="group-hover:underline">Instagram</span>
              <ExternalLink className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <a
              href="https://www.linkedin.com/in/arideep-kanshabanik"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
              style={{ textShadow: "0 0 8px rgba(6, 182, 212, 0.2)" }}
              data-testid="link-linkedin"
            >
              <Linkedin className="h-3.5 w-3.5" />
              <span className="group-hover:underline">LinkedIn</span>
              <ExternalLink className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <a
              href="https://arideep.framer.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
              style={{ textShadow: "0 0 8px rgba(6, 182, 212, 0.2)" }}
              data-testid="link-portfolio"
            >
              <span className="group-hover:underline">Portfolio</span>
              <ExternalLink className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <a
              href="mailto:arideepkanshabanik@gmail.com"
              className="group flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
              style={{ textShadow: "0 0 8px rgba(6, 182, 212, 0.2)" }}
              data-testid="link-email"
            >
              <Mail className="h-3.5 w-3.5" />
              <span className="group-hover:underline">Email</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
