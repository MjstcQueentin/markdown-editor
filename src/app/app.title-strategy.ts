import { Injectable } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { RouterStateSnapshot, TitleStrategy } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class AppTitleStrategy extends TitleStrategy {
    constructor(private readonly title: Title) {
        super();
    }
    override updateTitle(routerState: RouterStateSnapshot) {
        const title = this.buildTitle(routerState);
        if (title !== undefined) {
            this.title.setTitle(`${title} | Éditeur Markdown`);
        } else {
            this.title.setTitle(`Éditeur Markdown`);
        }
    }
}