import React from 'react';
import { templates, classes } from 'core/js/reactHelpers';

export default function Hotgraphic(props) {

  const {
    _graphic,
    _useGraphicsAsPins
  } = props;

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
