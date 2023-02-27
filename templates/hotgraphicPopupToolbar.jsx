import Adapt from 'core/js/adapt';
import React from 'react';
import { classes } from 'core/js/reactHelpers';

export default function HotgraphicPopupToolbar(props) {
  const a11yConfig = Adapt.config.get('_accessibility');
  const ariaLabels = Adapt.course.get('_globals')._accessibility._ariaLabels;

  const {
    onCloseClick,
    onControlClick,
    shouldEnableBack,
    shouldEnableNext,
    popupCount,
    backLabel,
    nextLabel,
    _hidePagination
  } = props;

  return (
    <div className={classes([
      'hotgraphic-popup__toolbar',
      _hidePagination && 'hide-pagination'
    ])}>

      {!_hidePagination &&
      <div className={classes([
        'hotgraphic-popup__nav',
        !shouldEnableBack && 'first',
        !shouldEnableNext && 'last'
      ])}
      >

        <button
          className={classes([
            'btn-icon hotgraphic-popup__controls back',
            !shouldEnableBack && 'is-disabled'
          ])}
          aria-label={backLabel}
          aria-disabled={!shouldEnableBack || null}
          onClick={onControlClick}
          data-direction='back'
        >
          <span className="icon" aria-hidden="true" />
        </button>

        <div
          className="hotgraphic-popup__count"
          dangerouslySetInnerHTML={{ __html: popupCount }}
          aria-hidden="true"
        />

        <button
          className={classes([
            'btn-icon hotgraphic-popup__controls next',
            !shouldEnableNext && 'is-disabled'
          ])}
          aria-label={nextLabel}
          aria-disabled={!shouldEnableNext || null}
          onClick={onControlClick}
          data-direction='next'
        >
          <span className="icon" aria-hidden="true" />
        </button>

      </div>
      }

      <button
        className="btn-icon hotgraphic-popup__close"
        aria-label={ariaLabels.closePopup}
        onClick={onCloseClick}
      >
        <span className="icon" aria-hidden="true" />
      </button>

      {a11yConfig._options._isPopupWrapFocusEnabled &&
      <a className="a11y-focusguard a11y-ignore a11y-ignore-focus" tabIndex="0" role="presentation" />
      }

    </div>
  );
}
