/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { ReactNode } from "react"
import { createUseStyles } from "react-jss"

const useStyles = createUseStyles({
  container: {
    width: "fit-content",
    display: "flex",
    alignItems: "flex-end"
  },
  content: {
    display: "inline-block",
    verticalAlign: "bottom",
    marginBottom: "7px"
  },
  icon: {
    display: "inline-block",
    paddingLeft: "2px",
    verticalAlign: "bottom"
  }
})

interface Props {
  children?: ReactNode
}

const ColumnHeading: React.FC<Props> = ({ children }) => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <div className={classes.content}>{children}</div>
    </div>
  )
}

export default ColumnHeading
