import { LitElement, html, css } from "lit";
import { property, state, customElement } from "lit/decorators.js";
import { greenDeck, redDeck, bothDeck } from "./data";
import { classMap } from "lit/directives/class-map.js";

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

type Card = string;

const shuffle = <T>(arr: Array<T>): Array<T> => {
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
  @state() drawPile: Array<Card> = [];
  @state() selected: Array<Card> = [];
  @state() rejected: Array<Card> = [];
  @state() completed: Array<Card> = [];
  @state() amount: number = 0;

  firstUpdated = () => {
    this.selected = JSON.parse(window.localStorage.getItem("selected") || 'null') || [];
    this.rejected = JSON.parse(window.localStorage.getItem("rejected") || 'null') || [];
    this.drawPile = JSON.parse(window.localStorage.getItem("drawPile") || 'null') || [];
    this.completed = JSON.parse(window.localStorage.getItem("completed") || 'null') || [];
    this.deck = JSON.parse(window.localStorage.getItem("deck") || 'null');
    this.amount = JSON.parse(window.localStorage.getItem("amount") || 'null') || 0;

    this.setSection()
  };

  getTitleText = () => {
    switch (this.section) {
      case Section.SelectDeck:
        return "Select classified deck:";
      case Section.SelectAmount:
        return "Select number of classifieds:";
      case Section.SelectClassifieds:
        return `Select classified${
          this.amount === 1 ? "" : ` ${this.selected.length + 1}`
        }:`;
      case Section.ViewClassifieds:
      default:
        return "";
    }
  };

  renderSection = () => {
    switch (this.section) {
      case Section.SelectDeck:
        return this.renderSelectDeck();
      case Section.SelectAmount:
        return this.renderSelectAmount();
      case Section.SelectClassifieds:
        return this.renderSelectClassifieds();
      case Section.ViewClassifieds:
        return this.renderViewClassifieds();
      default:
        return this.renderError();
    }
  };

  renderSelectDeck = () => {
    return html`
      <button
        class="space-bottom green"
        @click=${this.handleSelectDeck(Deck.Green)}
      >
        Green
      </button>
      <button
        class="space-bottom red"
        @click=${this.handleSelectDeck(Deck.Red)}
      >
        Red
      </button>
      <button
        class="space-bottom red-green"
        @click=${this.handleSelectDeck(Deck.Both)}
      >
        Both
      </button>
    `;
  };

  renderSelectAmount = () => {
    return html`
      <button class="space-bottom" @click=${this.handleSelectAmount(1)}>
        1
      </button>
      <button class="space-bottom" @click=${this.handleSelectAmount(2)}>
        2
      </button>
      <button class="space-bottom" @click=${this.handleSelectAmount(3)}>
        3
      </button>
      <button class="space-bottom" @click=${this.handleSelectAmount(4)}>
        4
      </button>
      <button class="space-bottom" @click=${this.handleSelectAmount(5)}>
        5
      </button>
    `;
  };

  renderSelectClassifieds = () => {
    const [one, two, ...rest] = this.drawPile;

    return html`
      <img class="card" src=${one} />
      <button @click=${this.handleSelectClassifieds(one, two, rest)}>
        Select
      </button>
      <img class="card" src=${two} />
      <button @click=${this.handleSelectClassifieds(two, one, rest)}>
        Select
      </button>
    `;
  };

  renderViewClassifieds = () => {
    return this.selected.map(image => {
      const completed = this.completed.includes(image);
      console.log(completed);

      return html`<img
          class=${classMap({ completed, card: true })}
          src=${image}
        />
        <button
          class="space-bottom"
          @click=${completed
            ? this.handleMarkAsIncomplete(image)
            : this.handleMarkAsComplete(image)}
        >
          Mark As ${completed ? "Incomplete" : "Complete"}
        </button>`;
    });
  };

  renderError = () => {
    return "error has occurred, please reset";
  };

  setSection = (): void => {
    if (this.deck === null) {
      this.section = Section.SelectDeck;
    }
    if (this.deck !== null) {
      this.section = Section.SelectAmount;
    }
    if (this.amount > 0) {
      this.section = Section.SelectClassifieds;
    }
    if (this.selected.length === this.amount && this.amount > 0) {
      this.section = Section.ViewClassifieds;
    }
  };

  handleSelectDeck = (deck: Deck) => (): void => {
    this.deck = deck;

    switch (deck) {
      case Deck.Green:
        this.drawPile = shuffle(greenDeck);
        break;
      case Deck.Red:
        this.drawPile = shuffle(redDeck);
        break;
      case Deck.Both:
        this.drawPile = shuffle(bothDeck);
        break;
      default:
        this.drawPile = [];
        break;
    }

    this.setSection();
    this.setStorage();
  };

  handleSelectAmount = (amount: number) => (): void => {
    this.amount = amount;
    this.setSection();
    this.setStorage();
  };

  handleSelectClassifieds = (
    selected: Card,
    rejected: Card,
    rest: Array<Card>
  ) => (): void => {
    this.selected = [...this.selected, selected];
    this.rejected = [...this.rejected, rejected];
    this.drawPile = rest;
    this.setSection();

    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    this.setStorage();
  };

  setStorage = () => {
    window.localStorage.setItem("selected", JSON.stringify(this.selected));
    window.localStorage.setItem("rejected", JSON.stringify(this.rejected));
    window.localStorage.setItem("drawPile", JSON.stringify(this.drawPile));
    window.localStorage.setItem("completed", JSON.stringify(this.completed));
    window.localStorage.setItem("deck", JSON.stringify(this.deck));
    window.localStorage.setItem("amount", JSON.stringify(this.amount));
  };

  handleMarkAsComplete = (card: Card) => (): void => {
    this.completed = [...this.completed, card];
    this.setStorage();
  };

  handleMarkAsIncomplete = (card: Card) => (): void => {
    const idx = this.completed.findIndex(c => c === card);

    this.completed = [
      ...this.completed.slice(0, idx),
      ...this.completed.slice(idx + 1)
    ];
    this.setStorage();
  };

  handleReset = (): void => {
    this.section = Section.SelectDeck;
    this.deck = null;
    this.selected = [];
    this.rejected = [];
    this.completed = [];
    this.amount = 0;
    this.setStorage();
  };

  static styles = css`
    :host {
    }

    * {
      box-sizing: border-box;
      font-family: Helvetica, sans-serif;
      font-size: 36px;
    }

    .completed {
      opacity: 0.5;
    }

    main {
      background-color: white;
      padding: 8px 8px 74px 8px;
      position: relative;
      min-height: 100vh;
    }

    button {
      width: 100%;
      text-transform: uppercase;
      color: white;
      padding: 8px;
      border: 1px solid black;
      border-radius: 4px;
      background-color: #00008b;
    }

    .reset {
      position: absolute;
      bottom: 8px;
      width: calc(100% - 16px);
    }

    .header {
      background-color: #00008b;
      margin: -8px -8px 8px -8px;

      color: white;
      display: flex;
      padding: 8px;
    }

    .header-text {
      font-size: 24px;
    }

    .green {
      background-color: yellowgreen;
    }

    .red {
      background-color: red;
    }

    .red-green {
      background-image: linear-gradient(to right, yellowgreen, red);
    }

    .space-bottom {
      margin-bottom: 8px;
    }

    .card {
      max-width: 100%;
    }

    h1 {
      font-size: 24px;
    }

    .body {
      display: flex;
      flex-direction: column;
      align-items: center;
      max-width: 400px;
      margin: 0 auto;
    }
  `;

  render() {
    return html`
      <main>
        <div class="header">
          <span class="header-text">Infinity Classified Selector</span>
        </div>

        <div class="body">
          ${this.section === Section.ViewClassifieds
            ? ""
            : html` <h1>${this.getTitleText()}</h1> `}
          ${this.renderSection()}
        </div>

        <button class="reset" @click=${this.handleReset}>Reset</button>
      </main>
    `;
  }
}
