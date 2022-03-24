import components from 'core/js/components';
import HotgraphicView from './hotgraphicView';
import ItemsComponentModel from 'core/js/models/itemsComponentModel';

export default components.register('hotgraphic', {
  model: ItemsComponentModel.extend({}),
  view: HotgraphicView
});
