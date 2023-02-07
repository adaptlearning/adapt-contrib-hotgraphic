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

  const itemAriaLabel = (index, pin, title) => {
    const arr = [];
    const separator = '. ';

    if (_useNumberedPins) {
      arr.push(index + 1);
    }

    if (pin.alt) {
      arr.push(pin.alt);
    } else {
      arr.push(title);
    }

    return { __html: arr.join(separator) };
  };

  return (
    <div className="hotgraphic__pins">

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

        {_items.map(({ _top, _left, _index, _graphic, _isVisited, _pin, title }, index) =>
          <div className="hotgraphic__pin-item" role="listitem" key={_index}>

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
              style={{ top: _top + '%', left: _left + '%' }}
            >

              <span className="aria-label" dangerouslySetInnerHTML={ itemAriaLabel(index, _pin, title) } />

              {_pin.src &&
              <span className="hotgraphic__pin-image-container item-{{@index}}">
                <img className="hotgraphic__pin-image" src={_pin.src} aria-hidden="true" />
              </span>
              }

              {!_pin.src && _useNumberedPins &&
                <span className="hotgraphic__pin-number" aria-hidden="true">
                  {index + 1}
                </span>
              }

              {!_pin.src && !_useNumberedPins &&
                <span className="icon" aria-hidden="true" />
              }

            </button>

          </div>
        )}

      </div>
    </div>
  );
}
