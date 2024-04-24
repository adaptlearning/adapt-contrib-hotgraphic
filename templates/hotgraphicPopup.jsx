import React, { useEffect } from 'react';
import a11y from 'core/js/a11y';
import { classes, compile, templates } from 'core/js/reactHelpers';

export default function HotgraphicPopup(props) {

  const {
    _items,
    _isRound
  } = props;

  useEffect(() => {
    const activeItem = _items.filter(item => item._isActive);

    if (!activeItem.length) return;

    const activeItemIndex = activeItem[0]._index;
    const focusElement = $(`.hotgraphic-popup__item[data-index=${activeItemIndex}]`);

    a11y.focusFirst(focusElement);
  });

  return (
    <div className='hotgraphic-popup__inner'>

      {_items.map(({ title, body, _graphic, _classes, _isVisited, _isActive, _imageAlignment }, index) =>
        <div className={classes([
          'hotgraphic-popup__item',
          _classes,
          _isRound && 'is-round',
          _isVisited && 'is-visited',
          _isActive && 'is-active',
          _graphic?.src && `align-image-${_imageAlignment || 'right'}`
        ])}
        key={index}
        data-index={index}
        aria-hidden={!_isActive ? true : null}
        >

          {(_imageAlignment === 'left' || _imageAlignment === 'top') &&
          <templates.image {..._graphic}
            classNamePrefixSeparator='__item-'
            classNamePrefixes={['component-item', 'hotgraphic-popup']}
            attributionClassNamePrefixes={['component', 'hotgraphic-popup']}
          />
          }

          <div className="hotgraphic-popup__item-content">
            <div className="hotgraphic-popup__item-content-inner">

              {title &&
              <div
                className={classes([
                  'hotgraphic-popup__item-title',
                  _isActive && 'notify-heading'
                ])}
                role="heading"
                aria-level={a11y.ariaLevel({ level: 'notify' })}
              >
                <div
                  className="hotgraphic-popup__item-title-inner"
                  dangerouslySetInnerHTML={{ __html: compile(title) }}
                />
              </div>
              }

              {body &&
              <div className="hotgraphic-popup__item-body">
                <div
                  className="hotgraphic-popup__item-body-inner"
                  dangerouslySetInnerHTML={{ __html: compile(body) }}
                />
              </div>
              }

            </div>
          </div>

          {(_imageAlignment !== 'left' && _imageAlignment !== 'top') &&
          <templates.image {..._graphic}
            classNamePrefixSeparator='__item-'
            classNamePrefixes={['component-item', 'hotgraphic-popup']}
            attributionClassNamePrefixes={['component', 'hotgraphic-popup']}
          />
          }

        </div>
      )}

      <templates.hotgraphicPopupToolbar {...props} />

    </div>

  );
}
