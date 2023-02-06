import React from 'react';
import Categories from '../components/Categories';
import Sort, { sortlist } from '../components/Sort';
import PizzaBlock from '../components/PizzaBlock';
import Skeleton from '../components/PizzaBlock/Skeleton';
import Pagination from '../components/Pagination';
import { SearchContext } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setCategoryId, setCurrentPage, setFilters } from '../redux/slices/filterSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';

export const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isSearch = React.useRef(false);

  const categoryId = useSelector((state) => state.filterSlice.categoryId);
  const sort = useSelector((state) => state.filterSlice.sort);
  const currentPage = useSelector((state) => state.filterSlice.currentPage);

  const { searchValue } = React.useContext(SearchContext);
  const [items, setItems] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const onChangePage = (page) => {
    dispatch(setCurrentPage(page));
  };

  const fetchPizzas = () => {
    setIsLoading(true);
    // const sortBy = sort.sortProperty.replace('-', '');
    // const order = sort.sortProperty.includes('-') ? 'ASC' : 'DESC';
    const search = searchValue ? `search=${searchValue}` : '';
    const category = categoryId > 0 ? `category=${categoryId}` : '';

    axios
      .get(
        `https://63d95a015a330a6ae17a1569.mockapi.io/items?page=${currentPage}&limit=4&${category}${search}`,
      )
      .then((res) => {
        setItems(res.data);
        setIsLoading(false);
      });
  };

  const onChangeCategory = (id) => {
    dispatch(setCategoryId(id));
  };

  // React.useEffect(() => {
  //   if (window.location.search) {
  //     const params = qs.parse(window.location.search.substring(1));

  //     const sort = sortlist.find((obj) => obj.sortProperty === params.sortProperty);
  //     dispatch(
  //       setFilters({
  //         ...params,
  //         sort,
  //       }),
  //     );
  //     isSearch.current = true;
  //   }
  // }, []);

  React.useEffect(() => {
    window.scrollTo(0, 0);
    if (!isSearch.current) {
      fetchPizzas();
    }
    isSearch.current = false;
  }, [categoryId, sort.sortProperty, currentPage, searchValue]);

  React.useEffect(() => {
    const queryString = qs.stringify({
      sortProperty: sort.sortProperty,
      categoryId,
      currentPage,
    });

    navigate(`?${queryString}`);
  }, [categoryId, sort.sortProperty, currentPage]);

  const pizzas = items
    .filter((obj) => {
      if (obj.title.toLowerCase().includes(searchValue.toLowerCase())) {
        return true;
      }

      return false;
    })
    .map((obj) => <PizzaBlock key={obj.id} {...obj} />);
  const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index} />);

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onClickCategory={onChangeCategory} />
        <Sort />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      <div className="content__items">{isLoading ? skeletons : pizzas}</div>
      <Pagination value={currentPage} onChangePage={onChangePage} />
    </div>
  );
};

export default Home;
