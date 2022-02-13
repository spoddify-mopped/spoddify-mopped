import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import styles from './Table.module.scss';

type TableHeadProps = {
  className?: string;
  onClick?: React.MouseEventHandler<HTMLTableHeaderCellElement>;
};

export const TableHead = (
  props: PropsWithChildren<TableHeadProps>
): React.ReactElement => (
  <th className={props.className} onClick={props.onClick}>
    {props.children}
  </th>
);

type TableRowProps = {
  className?: string;
};

export const TableRow = (
  props: PropsWithChildren<TableRowProps>
): React.ReactElement => <tr className={props.className}>{props.children}</tr>;

type TableDataProps = {
  className?: string;
  dataLabel?: string;
};

export const TableData = (
  props: PropsWithChildren<TableDataProps>
): React.ReactElement => (
  <td className={props.className} data-label={props.dataLabel}>
    {props.children}
  </td>
);

const Table = ({
  children,
}: PropsWithChildren<unknown>): React.ReactElement => {
  const mounted = useRef(false);
  const [stickyHeader, setStickyHeader] = useState(false);

  const tableHeaderRef = useCallback((node) => {
    const content = document.querySelector('.content') as HTMLDivElement;

    let tableHeaderY = 0;

    const onScroll = () => {
      if (mounted.current) {
        setStickyHeader(content.scrollTop > tableHeaderY);
      }
    };

    if (node) {
      tableHeaderY = node.getBoundingClientRect().y;
    }

    content.addEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  return (
    <table className={styles.flexTable}>
      <thead className={stickyHeader ? styles.sticky : ''} ref={tableHeaderRef}>
        <tr>
          {React.Children.map(children, (child) => {
            if (
              child &&
              typeof child === 'object' &&
              'type' in child &&
              child.type === TableHead
            ) {
              return child;
            }
          })}
        </tr>
      </thead>
      <tbody>
        {React.Children.map(children, (child) => {
          if (
            child &&
            typeof child === 'object' &&
            'type' in child &&
            child.type === TableRow
          ) {
            return child;
          }
        })}
      </tbody>
    </table>
  );
};

export default Table;
