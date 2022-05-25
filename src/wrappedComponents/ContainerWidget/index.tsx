import { FC } from "react"
import { DropTargetMonitor, useDrop } from "react-dnd"
import { useDispatch } from "react-redux"
import { v4 as uuidv4 } from "uuid"
import { DropInfo, dslActions } from "@/redux/editor/dsl/dslSlice"
import { DslActionName } from "@/redux/editor/dsl/dsl-action"
import { DraggableComponent } from "@/wrappedComponents/DraggableComponent"
import {
  widgetBuilder,
  WidgetTypeList,
} from "@/wrappedComponents/WidgetBuilder"
import { getTargetOffset } from "@/wrappedComponents/utils"
import { ContainerWidgetProps } from "./interface"
import { SearchIcon } from "@illa-design/icon"
import { ComponentModel } from "@/wrappedComponents/interface"

interface PanelDrag {
  type: string
  props: any
}

export const CONTAINER_WIDGET_CONFIG: ComponentModel = {
  type: "CONTAINER_WIDGET",
  widgetName: "Container",
  version: "0.0.1",
  icon: <SearchIcon />,
  sessionType: "COMMON",
  defaults: {
    backgroundColor: "#FFFFFF",
    rows: 40,
    columns: 24,
    width: "100%",
    height: "100%",
    containerStyle: "card",
    borderColor: "transparent",
    borderWidth: "0",
    borderRadius: "0",
    children: [],
  },
}

export const ContainerWidget: FC<ContainerWidgetProps> = (
  containerWidgetProps,
) => {
  const {
    children,
    props,
    id,
    type,
    props: { topRow, leftColumn },
  } = containerWidgetProps
  const dispatch = useDispatch()

  const [collectProps, dropTarget] = useDrop<PanelDrag, DropInfo, Object>(
    () => ({
      accept: WidgetTypeList,
      drop: (item, monitor: DropTargetMonitor) => {
        if (monitor.getDropResult<DropInfo>()?.hasDropped) {
          return monitor.getDropResult<DropInfo>()!!
        }
        if (item.type) {
          let monitorOffset = getTargetOffset(monitor?.getClientOffset(), id)
          dispatch(
            dslActions.dslActionHandler({
              type: DslActionName.AddItem,
              dslText: {
                ...item,
                props: { ...item.props, ...monitorOffset },
                parentId: id,
                id: "dsl" + uuidv4(),
              },
            }),
          )
          return {
            parent: containerWidgetProps,
            hasDropped: true,
          } as DropInfo
        }
        return {
          parent: containerWidgetProps,
          hasDropped: false,
        } as DropInfo
      },
    }),
    [topRow, leftColumn],
  )

  return (
    <DraggableComponent {...containerWidgetProps}>
      <div
        ref={dropTarget}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        {children?.map((value) => {
          const { type } = value
          const child = widgetBuilder(type)
          return (
            <DraggableComponent key={value.id} {...value}>
              <child.widget {...value} />
            </DraggableComponent>
          )
        })}
      </div>
    </DraggableComponent>
  )
}

ContainerWidget.displayName = "ContainerWidget"
