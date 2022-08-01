import { FC, ReactNode, useRef } from "react"
import { CloseIcon, RightIcon, WarningCircleIcon } from "@illa-design/icon"
import { ActionResultType } from "./interface"
import {
  errorIconStyle,
  errorResultWrapperStyle,
  resCloseIconStyle,
  resultContainerStyle,
  successIconStyle,
  successResultWrapperStyle,
} from "./style"
import { AxiosError } from "axios"
import i18n from "i18next"
import { CodeEditor } from "@/components/CodeEditor"
import { VALIDATION_TYPES } from "@/utils/validationFactory"
import { ApiError } from "@/api/base"
import { css } from "@emotion/react"

interface ActionResultProps {
  result?: ActionResultType
  onClose: () => void
}

export const ActionResult: FC<ActionResultProps> = (props) => {
  const { result, onClose } = props
  const res = result?.result
  const panelRef = useRef<HTMLDivElement>(null)

  return res ? (
    <div css={resultContainerStyle} ref={panelRef}>
      {result?.error ? (
        <div css={errorResultWrapperStyle}>
          <WarningCircleIcon css={errorIconStyle} size="16px" />
          <span>{(res as ApiError)?.errorMessage?.toString()}</span>
        </div>
      ) : (
        <>
          <div css={successResultWrapperStyle}>
            <div>
              <RightIcon css={successIconStyle} size="16px" />
              <span>{i18n.t("editor.action.result.title.success")}</span>
            </div>
            <CloseIcon css={resCloseIconStyle} onClick={onClose} />
          </div>
          <CodeEditor
            mode={"JSON"}
            expectedType={VALIDATION_TYPES.STRING}
            value={JSON.stringify(res, null, 2)}
            border={"unset"}
            borderRadius={"0"}
            maxHeight={
              panelRef.current ? `${panelRef.current?.clientHeight - 40}px` : ""
            }
            readOnly
            lineNumbers
          />
        </>
      )}
    </div>
  ) : (
    <div></div>
  )
}

ActionResult.displayName = "ActionResult"