import Adapt from 'core/js/adapt';
import React from 'react';
import { classes } from 'core/js/reactHelpers';

export default function HotgraphicLayoutPins(props) {
  // const hotgraphicGlobals = Adapt.course.get('_globals')._components._hotgraphic;
  // const ariaLabels = Adapt.course.get('_globals')._accessibility._ariaLabels;

  const {
    _items,
    _graphic,
    _useNumberedPins
  } = props;

  return (
    <div className='component__inner hotgraphic__inner'>

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

        {_items.map(({ _top, _left, _index, _graphic, _isVisited, _pin }) =>
          <div className="hotgraphic__pin-item" role="listitem" key={_index}>

            <button
              aria-haspopup="dialog"
              className={classes([
                'btn-icon hotgraphic__pin',
                `item-${_index}`,
                _graphic._classes,
                _isVisited && 'is-visited',
                (_pin && _pin.src) && 'has-pin-image'
              ])}
              data-index={_index}
              style={{ top: _top + '%', left: _left + '%' }}
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
                  Increment index by 1
                </span>
              }

              {!_pin.src && !_useNumberedPins &&
                <span className="icon" aria-hidden="true"></span>
              }

            </button>

          </div>
        )}

      </div>
    </div>
  );
}
