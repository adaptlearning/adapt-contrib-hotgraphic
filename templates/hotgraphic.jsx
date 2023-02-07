import Adapt from 'core/js/adapt';
import React from 'react';
import { templates, classes } from 'core/js/reactHelpers';

export default function Hotgraphic(props) {
  // const hotgraphicGlobals = Adapt.course.get('_globals')._components._hotgraphic;
  // const ariaLabels = Adapt.course.get('_globals')._accessibility._ariaLabels;

  const {
    _items,
    _graphic,
    _useGraphicsAsPins,
    _useNumberedPins
  } = props;

  // const itemAriaLabel = (_index, _graphic, _isVisited) => {
  //   const arr = [];
  //   const separator = '. ';

  //   // Visited state
  //   if (_isVisited) arr.push(ariaLabels.visited);

  //   // Show either graphic title or generic title
  //   if (_graphic.title) {
  //     arr.push(_graphic.title);
  //   } else {
  //     arr.push(`${hotgraphicGlobals.item} ${_index}`);
  //   }

  //   // Graphic alt text
  //   if (_graphic.alt) arr.push(_graphic.alt);

  //   return { __html: arr.join(separator) };
  // };

  return (
    <div className='component__inner hotgraphic__inner'>

      <templates.header {...props} />

      <div className={classes([
        'component__widget hotgraphic__widget',
        _useGraphicsAsPins ? 'is-tile' : 'is-pin',
        _graphic.attribution && 'has-attribution'
      ])}>

        {/* Grid layout */}
        {_useGraphicsAsPins &&

          <div className="hotgraphic__tile-item-container" role="list">

            {_items.map(({ _index, _graphic, _isVisited, title }) =>
              <div className="hotgraphic__tile-item" role="listitem" key={_index}>

                <button
                  aria-haspopup="dialog"
                  className={classes([
                    'hotgraphic__tile',
                    `item-${_index}`,
                    _graphic._classes,
                    _isVisited && 'is-visited'
                  ])}
                  data-index={_index}
                >

                  <span className="aria-label">{title}</span>

                  <img className="hotgraphic__tile-image" src={_graphic.src} aria-hidden="true" />

                  <div className="icon" aria-hidden="true" />

                </button>

              </div>
            )}

          </div>
        }

        {/* Standard layout */}
        {!_useGraphicsAsPins &&

          <img
            className="hotgraphic__image"
            src={_graphic.src}
            aria-label={_graphic.alt || null}
            aria-hidden={!_graphic.alt}
          />

          {_graphic.attribution &&
          <div className="component__attribution hotgraphic__attribution">
            <div className="component__attribution-inner hotgraphic__attribution-inner">
              {_graphic.attribution}
            </div>
          </div>
          }

          <div className="hotgraphic__pin-item-container" role="list">

            {_items.map(({ _pin, _top, _left, _index, _graphic, _isVisited }) =>
            <div className="hotgraphic__pin-item" role="listitem">

              <button
                aria-haspopup="dialog" 
                className={classes([
                  'btn-icon hotgraphic__pin',
                  `item-${_index}`,
                  _graphic._classes,
                  _isVisited && 'is-visited',
                  _pin.src && 'has-pin-image'
                ])}
                data-index={_index}
                style={`top: ${_top}%; left: ${_left}%;`}
              >

                <span className="aria-label">
                  {/* {{#if ../_useNumberedPins}}{{math @index "+" 1}} {{/if}}{{#if _pin.alt}}{{{compile _pin.alt}}}{{else}}{{{compile title}}}{{/if}}. */}
                </span>

                {_pin.src &&
                <span className="hotgraphic__pin-image-container item-{{@index}}">
                  <img className="hotgraphic__pin-image" src={_pin.src} aria-hidden="true" />
                </span>
                }

                {!_pin.src && _useNumberedPins &&

                  <span className="hotgraphic__pin-number" aria-hidden="true">
                    // math @index "+" 1
                  </span>

                }

                {!_pin.src && !_useNumberedPins &&
                  <span className="icon" aria-hidden="true"></span>
                }

                }

              </button>

            </div>
            )}

          </div>
        }

      </div>
    </div>
  );
}
