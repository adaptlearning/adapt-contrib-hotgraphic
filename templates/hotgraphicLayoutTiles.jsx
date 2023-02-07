import Adapt from 'core/js/adapt';
import React from 'react';
import { classes } from 'core/js/reactHelpers';

export default function HotgraphicLayoutTiles(props) {
  // const hotgraphicGlobals = Adapt.course.get('_globals')._components._hotgraphic;
  // const ariaLabels = Adapt.course.get('_globals')._accessibility._ariaLabels;

  const {
    _items
  } = props;

  return (
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
  );
}
