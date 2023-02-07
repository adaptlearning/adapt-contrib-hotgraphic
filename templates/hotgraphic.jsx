import Adapt from 'core/js/adapt';
import React from 'react';
import { templates, classes } from 'core/js/reactHelpers';

export default function Hotgraphic(props) {
  // const hotgraphicGlobals = Adapt.course.get('_globals')._components._hotgraphic;
  // const ariaLabels = Adapt.course.get('_globals')._accessibility._ariaLabels;

  const {
    _graphic,
    _useGraphicsAsPins
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

        {_useGraphicsAsPins &&
          <templates.hotgraphicLayoutTiles {...props} />
        }

        {!_useGraphicsAsPins &&
          <templates.hotgraphicLayoutPins {...props} />
        }

      </div>
    </div>
  );
}
