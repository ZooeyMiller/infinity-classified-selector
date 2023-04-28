import { LitElement, html, css } from "lit";
import { property, state, customElement } from "lit/decorators.js";

const logo = new URL("../../assets/open-wc-logo.svg", import.meta.url).href;

enum Section {
  SelectDeck,
  SelectAmount,
  SelectClassifieds,
  ViewClassifieds
}

enum Deck {
  Green,
  Red,
  Both
}

enum Card {
  TODO
}

@customElement("infinity-classified-selector")
export class InfinityClassifiedSelector extends LitElement {
  @state() section: Section = Section.SelectDeck;
  @state() deck: Deck | null = null;
  @state() selected: Array<Card> = [];
  @state() rejected: Array<Card> = [];
  @state() completed: Array<Card> = [];
  @state() amount: number = 0

  renderSection = () => {
    switch (this.section) {
      case SelectDeck:
        return this.renderSelectDeck();
      case SelectAmount:
        return this.renderSelectAmount();
      case SelectClassifieds:
        return this.renderSelectClassifieds();
      case ViewClassifieds:
        this.renderViewClassifieds();
      default:
        this.renderError();
    }
  };

  static styles = css``;

  render() {
    return html`
      <main>
        <div class="header">
          <span>Infinity Classified Selector</span>
        </div>

        <div class="body">
          ${this.renderSection()}
        </div>
      </main>
    `;
  }
}
