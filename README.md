#adapt-contrib-hotgraphic

A contributed hot graphic component that enables a user to click on hot spots over an image and display a detailed popup that includes an image with text.

##Installation


First, be sure to install the [Adapt Command Line Interface](https://github.com/cajones/adapt-cli), then from the command line run:-

        adapt install adapt-contrib-hotgraphic

This component can also be installed by adding the component to the adapt.json file before running `adapt install`:

        "adapt-contrib-hotgraphic": "*"

###Usage

Once installed, the component can be used to display an image with clickable 'hot spot' elements. The location of these hot spots are defined within the content. When a hot spot is clicked, a pop-up window appears which displays an image and text.

Controls are provided to move between the next and previous hot spots via the pop-up window.

##Settings overview

For example JSON format, see [example.json](https://github.com/adaptlearning/adapt-contrib-hotgraphic/blob/master/example.json). A description of the core settings can be found at: [Core model attributes](https://github.com/adaptlearning/adapt_framework/wiki/Core-model-attributes)

Further settings for this component are:

####_component

This value must be: `hotgraphic`

####_classes

You can use this setting to add custom classes to your template and LESS file.

####_layout

This defines the position of the component in the block. Values can be `full`, `left` or `right`. 

####mobileBody

This is optional body text that will be shown when viewed on mobile.

####_graphic

The main hot graphic image is defined within this element. This element should contain only one value for `src`, `alt` and `title`.

####src

Enter a path to the image. Paths should be relative to the src folder, e.g.

course/en/images/gqcq-1-large.gif

####alt

A value for alternative text can be entered here.

####title

Title text can be entered here for the image.

####_items

Multiple items can be entered. Each item represents one hot spot for this component and contains values for `title`, `body` and `_graphic`.

####title

This is the title text for a hot spot popup.

####body

This is the main text for a hot spot popup.

####_graphic

Each hotspot can contain an image. Details for the image are entered within this setting.

####src

Enter a path to the image. Paths should be relative to the src folder, e.g.

course/en/images/gqcq-1-large.gif

####alt

A value for alternative text can be entered here.

####title

This setting is for the title attribute on the image.

####strapline

Enter text for a strapline. This will be displayed when viewport size changes to the smallest range and is shown as a title above the image.

####_top

Each hot spot must contain `_top` and `_left` coordinates to position them on the hot graphic. 

Enter the number of pixels this hot spot should be from the top border of the main graphic.

####_left

Enter the number of pixels this hot spot should be from the left border of the main graphic.


##Limitations
 
When viewport size changes to the smallest range this component will behave like a narrative component. All information will be available but as a narrative rather than hot spots on a graphic.

##Browser spec

This component has been tested to the standard Adapt browser specification.






