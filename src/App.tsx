import { useCallback, useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import './App.scss';

const tabMarginHeight = 40;
const tabList = new Array(10).fill(0).map((_, index) => index + 1);
const contentList = tabList.slice();

function App(props) {
  const { threshold = 200 } = props;
  const [tabFixed, setTabFixed] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(-1);
  const tabRef = useRef<HTMLDivElement | null>(null);
  const topAreaRef = useRef<HTMLDivElement | null>(null);
  const tabContentRef = useRef<HTMLUListElement | null>(null);

  const getTabHeight = useCallback(() => {
    if (tabRef.current) {
      return tabRef.current.getBoundingClientRect().height + tabMarginHeight;
    }
  }, [tabRef]);

  const handleScroll = useCallback(() => {
    const topAreaElemRect = topAreaRef.current?.getBoundingClientRect();
    if (
      topAreaElemRect &&
      topAreaElemRect.bottom <= (-1 * tabMarginHeight) / 2
    ) {
      setTabFixed(true);
    } else {
      setTabFixed(false);
    }
    const contentList = Array.from(tabContentRef.current?.children || []);
    contentList.forEach((child, index) => {
      const childRect = child.getBoundingClientRect();
      if (childRect.top + threshold < document.documentElement.clientHeight) {
        setActiveTabIndex(index);
      }
    });
  }, []);

  const handleClick = (index: number) => {
    document.removeEventListener('scroll', handleScroll);
    setTimeout(() => {
      document.addEventListener('scroll', handleScroll);
    }, 800);

    const contentList = Array.from(tabContentRef.current?.children || []);
    setActiveTabIndex(index);
    const selectContent = contentList[index] as HTMLLIElement;
    const top =
      selectContent.offsetTop -
      document.documentElement.clientHeight +
      threshold;

    document.documentElement.scrollTo({
      top,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="container">
      <div className="top-area" ref={topAreaRef}>
        顶部区域
      </div>
      <div
        className={cx({
          'nav-bar-wrap': true,
          'nav-bar-wrap-fixed': tabFixed
        })}
        ref={tabRef}
      >
        <ul className="nav-bar">
          {tabList.map((it, index) => {
            return (
              <li
                key={it}
                className={cx({ active: activeTabIndex === index })}
                onClick={() => {
                  handleClick(index);
                }}
              >
                导航{it}
              </li>
            );
          })}
        </ul>
      </div>
      {tabFixed && <div style={{ height: `${getTabHeight()}px` }} />}
      <ul className="nav-content-container" ref={tabContentRef}>
        {contentList.map((it) => {
          return (
            <li key={it} className="content">
              导航{it}内容
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
