﻿import { Label as LabelDefinition } from "ui/label";
import { TextBase, View, whiteSpaceProperty, layout } from "ui/text-base";
import { Background } from "ui/styling/background";

export * from "ui/text-base";

enum FixedSize {
    NONE = 0,
    WIDTH = 1,
    HEIGHT = 2,
    BOTH = 3
}

export class LabelBase extends TextBase implements LabelDefinition {
    private _ios: UILabel;
    private _fixedSize: FixedSize;

    constructor() {
        super();

        this._ios = TNSLabel.new();
        this._ios.userInteractionEnabled = true;
    }

    get ios(): UILabel {
        return this._ios;
    }

    get _nativeView(): UILabel {
        return this._ios;
    }

    get textWrap(): boolean {
        return this.style.whiteSpace === "normal";
    }
    set textWrap(value: boolean) {
        this.style.whiteSpace = value ? "normal" : "nowrap";
    }

    public onLoaded() {
        super.onLoaded();
    }

    _requestLayoutOnTextChanged(): void {
        if (this._fixedSize === FixedSize.BOTH) {
            return;
        }
        if (this._fixedSize === FixedSize.WIDTH && !this.textWrap && this.getMeasuredHeight() > 0) {
            // Single line label with fixed width will skip request layout on text change.
            return;
        }
        super._requestLayoutOnTextChanged();
    }

    public onMeasure(widthMeasureSpec: number, heightMeasureSpec: number): void {
        var nativeView = this._nativeView;
        if (nativeView) {
            var width = layout.getMeasureSpecSize(widthMeasureSpec);
            var widthMode = layout.getMeasureSpecMode(widthMeasureSpec);

            var height = layout.getMeasureSpecSize(heightMeasureSpec);
            var heightMode = layout.getMeasureSpecMode(heightMeasureSpec);

            if (widthMode === layout.UNSPECIFIED) {
                width = Number.POSITIVE_INFINITY;
            }

            if (heightMode === layout.UNSPECIFIED) {
                height = Number.POSITIVE_INFINITY;
            }

            this._fixedSize = (widthMode === layout.EXACTLY ? FixedSize.WIDTH : FixedSize.NONE)
                | (heightMode === layout.EXACTLY ? FixedSize.HEIGHT : FixedSize.NONE);

            var nativeSize = nativeView.sizeThatFits(CGSizeMake(width, height));
            var labelWidth = nativeSize.width;

            if (!this.textWrap && this.style.whiteSpace !== "nowrap") {
                labelWidth = Math.min(labelWidth, width);
            }

            let style = this.sltye;
            var measureWidth = Math.max(labelWidth, style.effectiveMinWidth);
            var measureHeight = Math.max(nativeSize.height, style.effectiveMinHeight);

            var widthAndState = View.resolveSizeAndState(measureWidth, width, widthMode, 0);
            var heightAndState = View.resolveSizeAndState(measureHeight, height, heightMode, 0);

            this.setMeasuredDimension(widthAndState, heightAndState);
        }
    }

    get [whiteSpaceProperty.native](): string {
        return WhiteSpace.normal;
    }
    set [whiteSpaceProperty.native](value: string) {
        let nativeView = this.nativeView;
        if (value === WhiteSpace.normal) {
            nativeView.lineBreakMode = NSLineBreakMode.ByWordWrapping;
            nativeView.numberOfLines = 0;
        }
        else {
            nativeView.lineBreakMode = NSLineBreakMode.ByTruncatingTail;
            nativeView.numberOfLines = 1;
        }
    }
}

let zeroInsets = UIEdgeInsetsZero;

export class LabelStyler implements style.Styler {
    //Background methods
    private static setBackgroundInternalProperty(view: View, newValue: any) {
        var uiLabel: UILabel = <UILabel>view._nativeView;
        if (uiLabel && uiLabel.layer) {
            var flipImage = true;
            ensureBackground();
            var uiColor = <UIColor>background.ios.createBackgroundUIColor(view, flipImage);
            var cgColor = uiColor ? uiColor.CGColor : null;
            uiLabel.layer.backgroundColor = cgColor;
        }
    }

    private static resetBackgroundInternalProperty(view: View, nativeValue: any) {
        var uiLabel: UILabel = <UILabel>view._nativeView;
        if (uiLabel && uiLabel.layer) {
            var uiColor = <UIColor>nativeValue;
            var cgColor = uiColor ? uiColor.CGColor : null;
            uiLabel.layer.backgroundColor = cgColor;
        }
    }

    private static getNativeBackgroundInternalValue(view: View): any {
        var uiLabel: UILabel = <UILabel>view._nativeView;
        if (uiLabel && uiLabel.layer && uiLabel.layer.backgroundColor) {
            return UIColor.colorWithCGColor(uiLabel.layer.backgroundColor);
        }

        return undefined;
    }

    private static setBorderTopWidthProperty(view: View, newValue: number) {
        LabelStyler.setNativeBorderTopWidth(view, newValue);
    }

    private static resetBorderTopWidthProperty(view: View, nativeValue: number) {
        LabelStyler.setNativeBorderTopWidth(view, nativeValue);
    }

    private static setNativeBorderTopWidth(view: View, newValue: number) {
        let nativeView = <UIView>view._nativeView;
        if (nativeView instanceof TNSLabel) {
            nativeView.borderThickness = {
                top: newValue,
                right: nativeView.borderThickness.right,
                bottom: nativeView.borderThickness.bottom,
                left: nativeView.borderThickness.left
            };
        }
    }

    private static getBorderTopWidthProperty(view: View): number {
        let nativeView = <UIView>view._nativeView;
        if (nativeView instanceof TNSLabel) {
            return nativeView.borderThickness.top;
        }
        return 0;
    }

    private static setBorderRightWidthProperty(view: View, newValue: number) {
        LabelStyler.setNativeBorderRightWidth(view, newValue);
    }

    private static resetBorderRightWidthProperty(view: View, nativeValue: number) {
        LabelStyler.setNativeBorderRightWidth(view, nativeValue);
    }

    private static setNativeBorderRightWidth(view: View, newValue: number) {
        let nativeView = <UIView>view._nativeView;
        if (nativeView instanceof TNSLabel) {
            nativeView.borderThickness = {
                top: nativeView.borderThickness.top,
                right: newValue,
                bottom: nativeView.borderThickness.bottom,
                left: nativeView.borderThickness.left
            };
        }
    }

    private static getBorderRightWidthProperty(view: View): number {
        let nativeView = <UIView>view._nativeView;
        if (nativeView instanceof TNSLabel) {
            return nativeView.borderThickness.right;
        }
        return 0;
    }

    private static setBorderBottomWidthProperty(view: View, newValue: number) {
        LabelStyler.setNativeBorderBottomWidth(view, newValue);
    }

    private static resetBorderBottomWidthProperty(view: View, nativeValue: number) {
        LabelStyler.setNativeBorderBottomWidth(view, nativeValue);
    }

    private static setNativeBorderBottomWidth(view: View, newValue: number) {
        let nativeView = <UIView>view._nativeView;
        if (nativeView instanceof TNSLabel) {
            nativeView.borderThickness = {
                top: nativeView.borderThickness.top,
                right: nativeView.borderThickness.right,
                bottom: newValue,
                left: nativeView.borderThickness.left
            };
        }
    }

    private static getBorderBottomWidthProperty(view: View): number {
        let nativeView = <UIView>view._nativeView;
        if (nativeView instanceof TNSLabel) {
            return nativeView.borderThickness.bottom;
        }
        return 0;
    }

    private static setBorderLeftWidthProperty(view: View, newValue: number) {
        LabelStyler.setNativeBorderLeftWidth(view, newValue);
    }

    private static resetBorderLeftWidthProperty(view: View, nativeValue: number) {
        LabelStyler.setNativeBorderLeftWidth(view, nativeValue);
    }

    private static setNativeBorderLeftWidth(view: View, newValue: number) {
        let nativeView = <UIView>view._nativeView;
        if (nativeView instanceof TNSLabel) {
            nativeView.borderThickness = {
                top: nativeView.borderThickness.top,
                right: nativeView.borderThickness.right,
                bottom: nativeView.borderThickness.bottom,
                left: newValue
            };
        }
    }

    private static getBorderLeftWidthProperty(view: View): number {
        let nativeView = <UIView>view._nativeView;
        if (nativeView instanceof TNSLabel) {
            return nativeView.borderThickness.left;
        }
        return 0;
    }

    private static setPaddingProperty(view: View, newValue: UIEdgeInsets) {
        LabelStyler.setNativePadding(view, newValue);
    }

    private static resetPaddingProperty(view: View, nativeValue: UIEdgeInsets) {
        LabelStyler.setNativePadding(view, nativeValue);
    }

    private static setNativePadding(view: View, padding: UIEdgeInsets) {
        let nativeView = <UIView>view._nativeView;
        if (nativeView instanceof TNSLabel) {
            nativeView.padding = { top: padding.top, left: padding.left, bottom: padding.bottom, right: padding.right };
        }
    }

    private static getPaddingProperty(view: View): UIEdgeInsets {
        let nativeView = <UIView>view._nativeView;
        if (nativeView instanceof TNSLabel) {
            return nativeView.padding;
        }
        return zeroInsets;
    }

    public static registerHandlers() {
        style.registerHandler(style.backgroundInternalProperty, new style.StylePropertyChangedHandler(
            LabelStyler.setBackgroundInternalProperty,
            LabelStyler.resetBackgroundInternalProperty,
            LabelStyler.getNativeBackgroundInternalValue), "Label");

        style.registerHandler(style.borderTopWidthProperty, new style.StylePropertyChangedHandler(
            LabelStyler.setBorderTopWidthProperty,
            LabelStyler.resetBorderTopWidthProperty,
            LabelStyler.getBorderTopWidthProperty), "Label");
        style.registerHandler(style.borderRightWidthProperty, new style.StylePropertyChangedHandler(
            LabelStyler.setBorderRightWidthProperty,
            LabelStyler.resetBorderRightWidthProperty,
            LabelStyler.getBorderRightWidthProperty), "Label");
        style.registerHandler(style.borderBottomWidthProperty, new style.StylePropertyChangedHandler(
            LabelStyler.setBorderBottomWidthProperty,
            LabelStyler.resetBorderBottomWidthProperty,
            LabelStyler.getBorderBottomWidthProperty), "Label");
        style.registerHandler(style.borderLeftWidthProperty, new style.StylePropertyChangedHandler(
            LabelStyler.setBorderLeftWidthProperty,
            LabelStyler.resetBorderLeftWidthProperty,
            LabelStyler.getBorderLeftWidthProperty), "Label");

        style.registerHandler(style.nativePaddingsProperty, new style.StylePropertyChangedHandler(
            LabelStyler.setPaddingProperty,
            LabelStyler.resetPaddingProperty,
            LabelStyler.getPaddingProperty), "Label");
    }
}

LabelStyler.registerHandlers();