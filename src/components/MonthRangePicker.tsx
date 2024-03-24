import { KeyboardArrowRight } from "@mui/icons-material";
import { DatePicker } from "antd";
import dayjs from "dayjs";

export default function MonthRangePicker() {
  return (
    <>
      <DatePicker.RangePicker
        picker="month"
        placeholder={['Inicio', 'Fin']}
        lang="es"
        disabledDate={current => current && current.toDate() > new Date()}
        defaultValue={[dayjs().startOf('month'), dayjs().endOf('month')]}
        format={'MMM YY'}
        allowClear={false}
        variant="borderless"
        size="large"
        suffixIcon={null}
        separator={<KeyboardArrowRight />}
        allowEmpty={[false, false]}
        inputReadOnly
        style={{
          width: '200px',
          marginBottom: '5px',
          paddingBottom: 0,
          paddingLeft: 0,
          paddingTop: 0,
          height: '30px'
        }}
      />{' '}
      <style>
        {`
            .ant-picker-input > input {
              cursor: pointer;
              font-size: 1.5em !important;
              font-weight: bold !important;
            }
  
          
            .ant-picker-cell-in-view.ant-picker-cell-range-start
            .ant-picker-cell-inner {
              background-color: #D32F2F !important;
            }
  
          
            .ant-picker-cell-in-view.ant-picker-cell-range-end
            .ant-picker-cell-inner {
              background-color: #D32F2F !important;
            }
  
          
            .ant-picker-cell-in-view.ant-picker-cell-today
            .ant-picker-cell-inner::before {
              border-color: #B57175 !important;
            }
  
          
            .ant-picker-cell-in-view.ant-picker-cell-range-start:not(.ant-picker-cell-range-start-single)::before,
          
            .ant-picker-cell-in-view.ant-picker-cell-in-range::before,
          
            .ant-picker-cell-in-view.ant-picker-cell-range-end:not(.ant-picker-cell-range-end-single)::before,
          
            .ant-picker-time-panel-column
            > li.ant-picker-time-panel-cell-selected
            .ant-picker-time-panel-cell-inner {
              background: #B57175 !important;
            }
  
            .ant-picker-dropdown .ant-picker-cell-in-range .ant-picker-cell-inner {
              color: #fff !important;
            }
  
           .ant-btn-primary {
            background-color: #B57175 !important;
            border-color: #B57175 !important;
          }
  
          .ant-picker-range .ant-picker-active-bar {
            background-color: #D32F2F !important;
          }
  
          .ant-picker-dropdown .ant-picker-header-view button:hover,
          .ant-picker-dropdown .ant-picker-header-view button:active {
            color: #B57175 !important;
          }
  
          .ant-picker-panel-container {
            @media (max-width: 800px) {
                overflow: scroll !important;
                height: 100% !important;
                .ant-picker-panel-layout {
                    flex-direction: column !important;
        
                    .ant-picker-panels,
                    .ant-picker-datetime-panel {
                        flex-direction: column !important;
                    }
  
                    .ant-picker-panels > *:first-child button.ant-picker-header-next-btn {
                      visibility: visible !important;
                    }
                    
                    .ant-picker-panels > *:first-child button.ant-picker-header-super-next-btn {
                      visibility: visible !important;
                    }
                    
                    .ant-picker-panels > *:last-child {
                      display: none;
                    }
  
                    .ant-picker-panel-container {
                      height: 100% !important;
                    }
                    
                    .ant-picker-panel-container, .ant-picker-footer {
                      width: 280px !important;
                    }
                    
                    .ant-picker-footer-extra > div {
                      flex-wrap: wrap !important; 
                    }
                }
            }
          `}
      </style>
    </>
  )
}
