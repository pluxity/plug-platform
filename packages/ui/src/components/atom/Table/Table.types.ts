export interface TableBaseProps {
  unstyled?: boolean;
}

export interface TableProps extends React.ComponentProps<"table">, TableBaseProps {
  className?: string;
  children?: React.ReactNode;
}

export interface TableHeaderProps extends React.ComponentProps<"thead">, TableBaseProps {
  className?: string;
  children?: React.ReactNode;
}

export interface TableBodyProps extends React.ComponentProps<"tbody">, TableBaseProps {
  className?: string;
  children?: React.ReactNode;
}

export interface TableRowProps extends React.ComponentProps<"tr">, TableBaseProps {
  className?: string;
  children?: React.ReactNode;
}

export interface TableHeadProps extends React.ComponentProps<"th">, TableBaseProps {
  className?: string;
  children?: React.ReactNode;
}

export interface TableCellProps extends React.ComponentProps<"td">, TableBaseProps {
  className?: string;
  children?: React.ReactNode;   
}

export interface TableFooterProps extends React.ComponentProps<"tfoot">, TableBaseProps {
  className?: string;
  children?: React.ReactNode;
}

export interface TableCaptionProps extends React.ComponentProps<"caption">, TableBaseProps {
  className?: string;
}
