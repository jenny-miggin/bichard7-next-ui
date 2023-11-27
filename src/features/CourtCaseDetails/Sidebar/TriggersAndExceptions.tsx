import type { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import ConditionalRender from "components/ConditionalRender"
import { useCourtCaseContext } from "context/CourtCaseContext"
import { useCurrentUserContext } from "context/CurrentUserContext"
import { Tabs } from "govuk-react"
import { useState } from "react"
import { createUseStyles } from "react-jss"
import styled from "styled-components"
import type NavigationHandler from "types/NavigationHandler"
import Permission from "types/Permission"
import { AmendmentRecords } from "../../../types/Amendments"
import Exceptions from "./Exceptions"
import TriggersList from "./TriggersList"

const useStyles = createUseStyles({
  sideBar: {
    marginTop: "-41px"
  },
  tabPanelTriggers: {
    paddingTop: "10px"
  },
  tab: {
    cursor: "pointer",
    fontWeight: "bold"
  }
})

interface Props {
  aho: AnnotatedHearingOutcome
  onNavigate: NavigationHandler
  canResolveAndSubmit: boolean
  previousPath: string
  amendments: AmendmentRecords
}

const TabList = styled(Tabs.List)`
  & > li:only-child {
    display: flex;
    border-bottom: 1px solid #bfc1c3;

    a {
      flex-grow: 1;
      margin-right: 0;
      cursor: default;
      pointer-events: none;
    }
  }
`

const TriggersAndExceptions = ({ aho, onNavigate, canResolveAndSubmit, previousPath, amendments }: Props) => {
  const currentUser = useCurrentUserContext().currentUser
  const courtCase = useCourtCaseContext().courtCase

  const availableTabs = [Permission.Triggers, Permission.Exceptions].filter((tab) => currentUser.hasAccessTo[tab])
  const defaultTab =
    availableTabs.length > 0
      ? availableTabs.length == 2 && courtCase.triggerCount === 0
        ? availableTabs[1]
        : availableTabs[0]
      : undefined
  const [selectedTab, setSelectedTab] = useState(defaultTab)
  const classes = useStyles()

  return (
    <div className={`${classes.sideBar} triggers-and-exceptions-sidebar`}>
      <ConditionalRender isRendered={currentUser.hasAccessTo[Permission.CaseDetailsSidebar]}>
        <Tabs>
          <TabList>
            <ConditionalRender isRendered={currentUser.hasAccessTo[Permission.Triggers]}>
              <Tabs.Tab
                id="triggers-tab"
                className={classes.tab}
                onClick={() => setSelectedTab(Permission.Triggers)}
                selected={selectedTab === Permission.Triggers}
              >
                {`Triggers`}
              </Tabs.Tab>
            </ConditionalRender>

            <ConditionalRender isRendered={currentUser.hasAccessTo[Permission.Exceptions]}>
              <Tabs.Tab
                id="exceptions-tab"
                className={classes.tab}
                onClick={() => setSelectedTab(Permission.Exceptions)}
                selected={selectedTab === Permission.Exceptions}
              >
                {`Exceptions`}
              </Tabs.Tab>
            </ConditionalRender>
          </TabList>

          <ConditionalRender isRendered={currentUser.hasAccessTo[Permission.Triggers]}>
            <Tabs.Panel
              id="triggers"
              selected={selectedTab === Permission.Triggers}
              className={`moj-tab-panel-triggers ${classes.tabPanelTriggers}`}
            >
              <TriggersList onNavigate={onNavigate} />
            </Tabs.Panel>
          </ConditionalRender>

          <ConditionalRender isRendered={currentUser.hasAccessTo[Permission.Exceptions]}>
            <Tabs.Panel
              id="exceptions"
              selected={selectedTab === Permission.Exceptions}
              className="moj-tab-panel-exceptions"
            >
              <Exceptions
                aho={aho}
                onNavigate={onNavigate}
                canResolveAndSubmit={canResolveAndSubmit}
                previousPath={previousPath}
                amendments={amendments}
              />
            </Tabs.Panel>
          </ConditionalRender>
        </Tabs>
      </ConditionalRender>
    </div>
  )
}

export default TriggersAndExceptions
