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

const shuffle = arr => {
  const res = arr.map(value => ({ value, order: Math.random() }));

  res.sort((o1, o2) =>
    o1.order > o2.order ? 1 : o1.order < o2.order ? -1 : 0
  );

  return res.map(({ value }) => value);
};

@customElement("infinity-classified-selector")
export class InfinityClassifiedSelector extends LitElement {
  @state() section: Section = Section.SelectDeck;
  @state() deck: Deck | null = null;
  @state() selected: Array<Card> = [];
  @state() rejected: Array<Card> = [];
  @state() completed: Array<Card> = [];
  @state() amount: number = 0;

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

  firstUpdated = (): void => {
    // TODO: localStorage check + load
  }

  handleSelectDeck = (deck: Deck) => (): void => {
    this.deck = deck;
  };

  handleSelectAmount = (amount: number) => (): void => {
    this.amount = amount;
  };

  handleSelectClassifieds = (selected: Card, rejected: Card) => (): void => {
    this.selected = [...this.selected, selected];
    this.rejected = [...this.rejected, rejected];
    // TODO: localStorage set
  };

  handleMarkAsComplete = (card: Card) => (): void => {
    this.completed = [...this.completed, card];
    // TODO: localStorage set
  };

  handleReset = (): void => {
    this.section = Section.SelectDeck;
    this.deck = null;
    this.selected = [];
    this.rejected = [];
    this.completed = [];
    this.amount = 0;
    // TODO: localStorage reset
  };

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
