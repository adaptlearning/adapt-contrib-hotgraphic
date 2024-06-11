# adapt-contrib-hotgraphic

**Hot Graphic** is a *presentation component* bundled with the [Adapt framework](https://github.com/adaptlearning/adapt_framework).
<img src="https://github.com/adaptlearning/documentation/blob/master/04_wiki_assets/plug-ins/images/hotgraphic01.gif" alt="Hot Graphic in action">

When a learner clicks on a hot spot within the image, a pop-up is displayed that consists of text with an image. [Visit the **Hot Graphic** wiki](https://github.com/adaptlearning/adapt-contrib-hotgraphic/wiki) for more information about its functionality and for explanations of key properties.

In the standard configuration, the 'hot spots' are clickable 'pin' icons overlaying the main image - but it's possible to replace the default 'pin' icon with a custom image (see the [_pin](#_pin-object) setting for more information) or, using the [_useGraphicsAsPins](#_usegraphicsaspins-boolean) setting, create a 'tiled layout' of images where each 'tile' acts as a hot spot.

By default, when the viewport size changes to the smallest range, this component will behave like a [**Narrative** component](https://github.com/adaptlearning/adapt-contrib-narrative). All information will remain available but formatted as a narrative rather than as hot spots on a graphic. This behaviour can be overridden by changing the [_isNarrativeOnMobile](#_isnarrativeonmobile-boolean) setting to `false`.

## Installation

As one of Adapt's *[core components](https://github.com/adaptlearning/adapt_framework/wiki/Core-Plug-ins-in-the-Adapt-Learning-Framework#components),* **Hot Graphic** is included with the [installation of the Adapt framework](https://github.com/adaptlearning/adapt_framework/wiki/Manual-installation-of-the-Adapt-framework#installation) and the [installation of the Adapt authoring tool](https://github.com/adaptlearning/adapt_authoring/wiki/Installing-Adapt-Origin).

* If **Hot Graphic** has been uninstalled from the Adapt framework, it may be reinstalled.
With the [Adapt CLI](https://github.com/adaptlearning/adapt-cli) installed, run the following from the command line:
    ```console
    adapt install adapt-contrib-hotgraphic
    ```

    Alternatively, this component can also be installed by adding the following line of code to the *adapt.json* file:
    ```json
    "adapt-contrib-hotgraphic": "*"
    ```
    Then running the command:
    ```console
    adapt install
    ```
    (This second method will reinstall all plug-ins listed in *adapt.json*.)

* If **Hot Graphic** has been uninstalled from the Adapt authoring tool, it may be reinstalled using the [Plug-in Manager](https://github.com/adaptlearning/adapt_authoring/wiki/Plugin-Manager).
<div float align=right><a href="#top">Back to Top</a></div>

## Settings Overview

The attributes listed below are used in *components.json* to configure **Hot Graphic**, and are properly formatted as JSON in [*example.json*](https://github.com/adaptlearning/adapt-contrib-hotgraphic/blob/master/example.json). Visit the [**Hot Graphic** wiki](https://github.com/adaptlearning/adapt-contrib-hotgraphic/wiki) for more information about how they appear in the [authoring tool](https://github.com/adaptlearning/adapt_authoring/wiki).

## Attributes

[**core model attributes**](https://github.com/adaptlearning/adapt_framework/wiki/Core-model-attributes): These are inherited by every Adapt component. [Read more](https://github.com/adaptlearning/adapt_framework/wiki/Core-model-attributes).

### \_component (string):
This must be set to: `"hotgraphic"`.

### \_classes (string):
CSS class name(s) to be applied to this component's containing `div`. The class must be predefined in one of the Less files. Separate multiple classes with a space.

### \_layout (string):
This defines the horizontal position of the component in the block. Acceptable values are `full`, `left` or `right`.

### instruction (string):
This optional text appears above the component. It is frequently used to
guide the learner’s interaction with the component.

### mobileBody (string):
This is optional text that will be substituted for `body` when `device.screenSize` is `small` (i.e. when viewed on mobile devices, except when the [_isNarrativeOnMobile](#_isnarrativeonmobile-boolean) setting is set to `false`).

### mobileInstruction (string):
This is optional text that will be substituted for `instruction` when `device.screenSize` is `small` (i.e. when viewed on mobile devices, except when the [_isNarrativeOnMobile](#_isnarrativeonmobile-boolean) setting is set to `false`).

### \_isMobileTextBelowImage (boolean):
Like `mobileBody` and `mobileInstruction`, `_isMobileTextBelowImage` is only applicable when `device.screenSize` is `small` (i.e. when viewed on mobile devices, except when the [_isNarrativeOnMobile](#_isnarrativeonmobile-boolean) setting is set to `false`). The default is `false`. When set to `true`, the replacement Narrative will not use the default "strapline" layout. Instead both the image and text of each stage remain visible, with the text positioned below the image.

### \_setCompletionOn (string):
Determines when Adapt will register this component as having been completed by the learner. Acceptable values are `"allItems"` and `"inview"`. `"allItems"` requires each pop-up item to be visited. `"inview"` requires the **Hot Graphic** component to enter the view port completely.

### \_canCycleThroughPagination (boolean):
Enables the pop-ups to be cycled through endlessly using either the previous or next icon. When set to `true`, clicking "next" on the final stage will display the very first stage. When set to `false`, the final stage will display only a "previous" icon. The default is `false`.

### \_hidePagination (boolean):
When set to `true`, hides the "previous" and "next" icons and progress indicator (e.g., "1/5") on the pop-up's toolbar. The default is `false`.

### \_isNarrativeOnMobile (boolean):
When set to `false` the Hotgraphic will render a scaled down 'desktop' version (pins over image / tiles) of the component in mobile view instead of being replaced by a Narrative interaction. The default is `true`.

### \_isMobileTextBelowImage (boolean):
If enabled, on mobile, the text area drops below the image instead of being behind the strapline button. When using `_isStackedOnMobile: true` or `_isNarrativeOnMobile: false`, this attribute will be ignored. The default value is `false`

### \_isStackedOnMobile (boolean):
If enabled, on mobile, text and images will be stacked vertically. No interaction will be required to view all items as the user will simply scroll down. `_isNarrativeOnMobile` must be set to `true`. The default value is `false`

### \_useNumberedPins (boolean):
If set to `true`, the pin icons will be replaced with the item number. Useful if you want pins to be visited in a set order or show steps in a process. The default is `false`.

### \_useGraphicsAsPins (boolean):
If set to `true`, the image specified by `_graphic.src` will be ignored and the popup images specified in `_items[n]._graphic.src` will instead be laid out in a 2 item width grid system. See [example.json](example.json#L79-L115) for a working example. The default is `false`.

### \_hasStaticTooltips (boolean):
If set to `true`, tooltips (if enabled) will always be shown rather than only on hover.

### \_isRound (boolean):
If set to `true`, the popup images will inherit a 50% border radius. Ideal for use with images that are square that are required to be round. The default is `false`.

### \_pinOffsetOrigin (boolean):
If set to `true`, the pins origin point will be changed from `top left` to `center`. This option will enable the pin to remain stationary when viewing responsively. The default is `false`.

### \_tooltip (object):

#### \_isEnabled (boolean):
When set to `true` the tooltip will be shown on hover over the item. When `_hasStaticTooltips` is set to `true`, the tooltip will always be shown. The default is `false`.

#### text (string):
The tooltip text to display for the item.

#### \_position (string):
The tooltip position in relation to the pin. Can be any combination of `top`, `left`, `right`, and `bottom` (e.g. `top left` or `bottom`). The default is `bottom`.

### \_graphic (object):
The graphic object that defines the image over which the hot spots are rendered (except when the [_useGraphicsAsPins](#_usegraphicsaspins-boolean) setting is enabled). It contains the following settings:

#### src (string):
File name (including path) of the image. Path should be relative to the `src` folder (e.g. `"course/en/images/origami-menu-two.jpg"`).

#### alt (string):
The alternative text for this image. Assign [alt text](https://github.com/adaptlearning/adapt_framework/wiki/Providing-good-alt-text) to images that convey course content only.

#### attribution (string):
Optional text to be displayed as an [attribution](https://wiki.creativecommons.org/Best_practices_for_attribution). By default it is displayed below the image. Adjust positioning by modifying CSS. Text can contain HTML tags, e.g., `Copyright © 2015 by <b>Lukasz 'Severiaan' Grela</b>`.

### \_items (array):
Multiple items may be created. Each entry in the array should be an object, containing the following settings:

#### \_top (number):
Each item must contain `_top` and `_left` coordinates to define its position over the main graphic. Enter a percentage value (0-100) that this item should be from the top border of the main graphic.

#### \_left (number):
Enter a percentage value (0-100) that this item should be from the left border of the main graphic.

#### title (string):
This is the title text for the hot spot's pop-up.

#### body (string):
This is the main text for a hot spot pop-up.

#### strapline (string):
This text is displayed when `device.screenSize` is `small` (i.e. when viewed on mobile devices, except when the [_isNarrativeOnMobile](#_isnarrativeonmobile-boolean) setting is set to `false`). It is presented in a title bar above the image.

#### \_imageAlignment (string):
Defines the alignment of the item image in the pop up. Left: Image aligned to the left of the text area. Top: Image aligned above the text area. Right: Image aligned to the right of the text area. Bottom: Image aligned below the text area. The default alignment is `right`.

#### \_classes (string):
CSS class name(s) to be applied to the popup item. Classes available by default are:
* `"hide-desktop-image"` (hides the pop up image in desktop view)
* `"hide-popup-image"` (hides the pop up image for all screen sizes)

Any other classes need to be predefined in one of the Less files. Separate multiple classes with a space.

#### \_graphic (object):
The image that is associated with this item - which will be displayed in a popup when the pin is selected by the learner (although note that the [_useGraphicsAsPins](#_usegraphicsaspins-boolean) setting allows for it to be used as a 'tile' in the main image instead). It contains the following settings:

##### src (string):
File name (including path) of the image. Path should be relative to the `src` folder (e.g. `"course/en/images/origami-menu-two.jpg"`).

##### alt (string):
The alternative text for this image. Assign [alt text](https://github.com/adaptlearning/adapt_framework/wiki/Providing-good-alt-text) to images that convey course content only.

##### attribution (string):
Optional text to be displayed as an [attribution](https://wiki.creativecommons.org/Best_practices_for_attribution). By default it is displayed below the image. Adjust positioning by modifying CSS. Text can contain HTML tags, e.g., `Copyright © 2015 by <b>Lukasz 'Severiaan' Grela</b>`.

##### \_classes (string):
CSS class name(s) to be applied to hotgraphic pin or, alternatively, to the hotspot tile when [_useGraphicsAsPins](#_usegraphicsaspins-boolean) is set to `true`. The class must be predefined in one of the Less files. Separate multiple classes with a space.

#### \_pin (object):
Optional image that can appear instead of the default pin icon. See [example.json](example.json#L117-L160) for a working example. It contains the following settings:

##### src (string):
File name (including path) of the image. Path should be relative to the `src` folder (e.g. `"course/en/images/origami-menu-two.jpg"`).

##### alt (string):
The alternative text for this image. Assign [alt text](https://github.com/adaptlearning/adapt_framework/wiki/Providing-good-alt-text) to images that convey course content only.

## Accessibility
**Hot Graphic** has been assigned a descriptive label using the [aria-label](https://github.com/adaptlearning/adapt_framework/wiki/Aria-Labels) attribute: **ariaRegion**.

Other descriptive labels are used to provide context of the previous, current and next item. The following attributes are used to provide this functionality: **item**, **previous** and **next**.

These labels are not visible elements. They are utilized by assistive technology (such as screen readers). Should any of these labels need to be customised or translated, they can be found within the **globals** object in [*properties.schema*](https://github.com/adaptlearning/adapt-contrib-hotgraphic/blob/master/properties.schema) (or Project settings > Globals in the Adapt Authoring Tool).
<div float align=right><a href="#top">Back to Top</a></div>

----------------------------
<a href="https://community.adaptlearning.org/" target="_blank"><img src="https://github.com/adaptlearning/documentation/blob/master/04_wiki_assets/plug-ins/images/adapt-logo-mrgn-lft.jpg" alt="adapt learning logo" align="right"></a>
**Author / maintainer:** Adapt Core Team with [contributors](https://github.com/adaptlearning/adapt-contrib-hotgraphic/graphs/contributors)
**Accessibility support:** WAI AA
**RTL support:** Yes
**Cross-platform coverage:** Chrome, Chrome for Android, Firefox (ESR + latest version), Edge, Safari 14 for macOS/iOS/iPadOS, Opera
