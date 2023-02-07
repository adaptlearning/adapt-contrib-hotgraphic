import components from 'core/js/components';
import HotgraphicView from './hotgraphicView';
import HotgraphicModel from './hotgraphicModel';

export default components.register('hotgraphic', {
  model: HotgraphicModel,
  view: HotgraphicView
});
