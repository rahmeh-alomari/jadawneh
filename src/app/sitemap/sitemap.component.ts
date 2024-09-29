import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sitemap',
  templateUrl: './sitemap.component.html',
  styleUrls: ['./sitemap.component.scss']
})
export class SitemapComponent implements OnInit {
  sitemapContent: string = '';
  baseUrl: string = 'https://podqasti.com/';
  prefix: string;

  constructor(private router: Router) { }

  ngOnInit(): void {
    const locale = JSON.parse(localStorage.getItem('locale') || '{"prefix": "ar"}');
    this.prefix = locale.prefix;

    this.generateSitemap().then((sitemap) => {
      this.sitemapContent = sitemap;
      console.log(this.sitemapContent);
    });
  }

  async generateSitemap(): Promise<string> {
    let sitemap = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    const addRoutes = async (routes: any[], parentPath: string = '') => {
      for (const route of routes) {
        const fullPath = `${parentPath}${route.path}`.replace(/\/{2,}/g, '/');

        if (fullPath) {
          const loc = `${this.baseUrl}#/${this.prefix}${fullPath.replace(':locale', '')}`;
          const lastModified = this.getLastModifiedForRoute(fullPath);
          const changefreq = this.getChangefreqForRoute(fullPath);
          const priority = this.getPriorityForRoute(fullPath);

          sitemap += `
<url>
  <loc>${loc}</loc>
  <lastmod>${lastModified}</lastmod>
  <changefreq>${changefreq}</changefreq>
  <priority>${priority}</priority>
</url>\n`;
        }

        if (route.children) {
          await addRoutes(route.children, fullPath + '/');
        }
      }
    };

    await addRoutes(this.router.config);
    sitemap += `</urlset>\n`;
    return sitemap;
  }

  private getLastModifiedForRoute(routePath: string): string {
    return new Date().toISOString().split('T')[0];
  }

  getChangefreqForRoute(path: string): string {
    // Adjust this logic as needed
    if (path.includes('/home')) {
      return 'daily';
    } else if (path.includes('/about')) {
      return 'monthly';
    } else {
      return 'weekly';  // Default value
    }
  }

  getPriorityForRoute(path: string): number {
    // Adjust this logic as needed
    if (path.includes('/home')) {
      return 1.0;  // Highest priority
    } else if (path.includes('/contact')) {
      return 0.5;  // Lower priority
    } else {
      return 0.8;  // Default priority
    }
  }

  parseSitemap(sitemap: string): Array<{ loc: string, lastmod: string, changefreq: string, priority: string }> {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(sitemap, "application/xml");
    const urls = xmlDoc.getElementsByTagName("url");
    const result: Array<{ loc: string, lastmod: string, changefreq: string, priority: string }> = [];

    for (let i = 0; i < urls.length; i++) {
        const locElement = urls[i].getElementsByTagName("loc")[0];
        const lastmodElement = urls[i].getElementsByTagName("lastmod")[0];
        const changefreqElement = urls[i].getElementsByTagName("changefreq")[0]; // Extracting changefreq
        const priorityElement = urls[i].getElementsByTagName("priority")[0]; // Extracting priority

        const loc = locElement ? locElement.textContent : '';
        const lastmod = lastmodElement ? lastmodElement.textContent : '';
        const changefreq = changefreqElement ? changefreqElement.textContent : ''; // Getting changefreq value
        const priority = priorityElement ? priorityElement.textContent : ''; // Getting priority value

        if (loc) {
            result.push({ loc, lastmod, changefreq, priority }); // Including changefreq and priority in the result
        }
    }

    return result;
}


}
