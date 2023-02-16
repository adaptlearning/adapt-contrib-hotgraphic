import React from 'react';
import { classes } from 'core/js/reactHelpers';

export default function HotgraphicLayoutPins(props) {

  const {
    _items,
    _graphic,
    _useNumberedPins,
    onPinClicked
  } = props;

  const itemAriaLabel = (index, pin, title) => {
    const arr = [];
    const separator = '. ';

    if (_useNumberedPins) {
      arr.push(index + 1);
    }

    const labelTitle = pin.alt || title;
    arr.push(labelTitle);

    return { __html: arr.join(separator) };
  };

  return (
    <div className="hotgraphic__pins">

      <img
        className="hotgraphic__image"
        src={_graphic.src}
        aria-label={_graphic.alt || null}
        aria-hidden={!_graphic.alt || null}
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
              className={classes([
                'btn-icon hotgraphic__pin',
                `item-${_index}`,
                _graphic._classes,
                _isVisited && 'is-visited',
                _pin.src && 'has-pin-image'
              ])}
              data-index={_index}
              onClick={onPinClicked}
              style={{ top: _top + '%', left: _left + '%' }}
            >

              <span className="aria-label" dangerouslySetInnerHTML={ itemAriaLabel(index, _pin, title) } />

              {_pin.src &&
              <span className={classes([
                'hotgraphic__pin-image-container',
                `item-${_index}`
              ])}>
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
