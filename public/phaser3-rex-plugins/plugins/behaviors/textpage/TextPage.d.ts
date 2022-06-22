export default TextPage;

declare namespace TextPage {
    interface IConfig {
        text?: string | string[],
        maxLines?: number,
        pageBreak?: string,
    }
}

declare class TextPage {
    constructor(
        gameObject: Phaser.GameObjects.GameObject,
        config?: TextPage.IConfig
    );

    setMaxLines(maxLines: number): this;
    maxLines: number;

    setPageBreak(pageBreak?: string): this;
    pageBreak: string;

    setText(text: string | string[]): this;
    appendText(text: string | string[]): this;
    appendPage(text: string | string[]): this;
    clearText(): this;

    showPage(pageIndex?: number): this;
    showNextPage(): this;
    showPreviousPage(): this;

    getPage(pageIndex?: number): this;
    getNextPage(): this;
    getPreviousPage(): this;

    readonly isLastPage: boolean;
    readonly isFirstPage: boolean;

    readonly pageIndex: number;
    readonly pageCount: number;
}