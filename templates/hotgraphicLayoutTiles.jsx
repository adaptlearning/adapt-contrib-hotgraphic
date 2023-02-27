import Adapt from 'core/js/adapt';
import React from 'react';
import { classes, compile } from 'core/js/reactHelpers';

export default function HotgraphicLayoutTiles(props) {
  const globals = Adapt.course.get('_globals');
  const visitedLabel = globals?._accessibility?._ariaLabels.visited;

  const {
    _items,
    onPinClicked
  } = props;

  return (
    <div className="hotgraphic__tile-item-container" role="list">

      {_items.map(({ _index, _graphic, _isVisited, title }) => {

        const visited = _isVisited ? visitedLabel + '. ' : '';
        const itemTitle = title + '. ';
        const itemCount = compile(globals._components._hotgraphic.item, { itemNumber: _index + 1, totalItems: _items.length });
        const ariaLabel = visited + itemTitle + itemCount;

        return (
          <div className="hotgraphic__tile-item" role="listitem" key={_index}>

            <button
              className={classes([
                'hotgraphic__tile',
                `item-${_index}`,
                _graphic._classes,
                _isVisited && 'is-visited'
              ])}
              data-index={_index}
              onClick={onPinClicked}
            >

              <span className="aria-label">{ariaLabel}</span>

              <img className="hotgraphic__tile-image" src={_graphic.src} aria-hidden="true" />

              <div className="icon" aria-hidden="true" />

            </button>

          </div>
        );
      })}

    </div>
  );
}
