import Adapt from 'core/js/adapt';
import React from 'react';
import { classes, compile } from 'core/js/reactHelpers';

export default function HotgraphicLayoutPins(props) {
  const globals = Adapt.course.get('_globals');
  const visitedLabel = globals?._accessibility?._ariaLabels.visited;

  const {
    _items,
    _graphic,
    _useNumberedPins,
    _pinOffsetOrigin,
    _tooltip,
    onPinClicked
  } = props;

  return (
    <div className="hotgraphic__pins">

      {_graphic &&
      <img
        className="hotgraphic__image"
        src={_graphic.src}
        aria-label={_graphic.alt || null}
        aria-hidden={!_graphic.alt || null}
        data-tooltip-id={_tooltip?._isEnabled && _tooltip?._id}
      />
      }

      {_graphic?.attribution &&
      <div className="component__attribution hotgraphic__attribution">
        <div
          className="component__attribution-inner hotgraphic__attribution-inner"
          dangerouslySetInnerHTML={{ __html: compile(_graphic.attribution, _graphic) }}
        />
      </div>
      }

      <div className="hotgraphic__pin-item-container" role="list">

        {_items.map(({ _top, _left, _index, _graphic, _isVisited, _pin, title, _tooltip }, index) => {

          const visited = _isVisited ? visitedLabel?.trim?.() + '. ' : '';
          const numbered = _useNumberedPins ? (index + 1) + '. ' : '';
          const itemTitle = (_pin.alt || title)?.trim?.() + '. ';
          const itemCount = compile(globals._components?._hotgraphic?.item || '', { itemNumber: _index + 1, totalItems: _items.length });
          const ariaLabel = `${visited}${numbered}${itemTitle}${itemCount}`;

          return (
            <div className="hotgraphic__pin-item" role="listitem" key={_index}>

              <button
                className={classes([
                  'btn-icon hotgraphic__pin',
                  `item-${_index}`,
                  _graphic?._classes,
                  _isVisited && 'is-visited',
                  _pin.src && 'has-pin-image',
                  (_pin.src && _pin.srcHover && _pin.srcVisited) && 'has-pin-image-states',
                  _useNumberedPins && 'is-numbered-pin',
                  _pinOffsetOrigin && 'offset-origin'
                ])}
                data-index={_index}
                onClick={onPinClicked}
                style={{ top: _top + '%', left: _left + '%' }}
                data-tooltip-id={_tooltip?._id}
              >

                <span className="aria-label" dangerouslySetInnerHTML={{ __html: compile(ariaLabel) }} />

                {_pin.src &&
                <span className={classes([
                  'hotgraphic__pin-image-container',
                  `item-${_index}`
                ])}>
                  <img className="hotgraphic__pin-image is-default" src={_pin.src} aria-hidden="true" />

                  {_pin.srcHover &&
                    <img className="hotgraphic__pin-image is-hover" src={_pin.srcHover} />
                  }

                  {_pin.srcVisited &&
                    <img className="hotgraphic__pin-image is-visited" src={_pin.srcVisited} />
                  }
                </span>
                }

                {(_useNumberedPins && !_isVisited) &&
                  <span className="hotgraphic__pin-number" aria-hidden="true">
                    {index + 1}
                  </span>
                }

                {((!_pin.src && !_useNumberedPins) || _isVisited) &&
                  <span className="icon" aria-hidden="true" />
                }

              </button>

            </div>
          );
        })}

      </div>
    </div>
  );
}
