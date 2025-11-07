import regexs from "@/constants/regexs";
import type { DataCollect } from "@/models/data-collect";
import useHealthReportStore from "@/stores/useHealthReportStore";
import { CloseCircleOutlined, ExclamationCircleOutlined, FormOutlined } from "@ant-design/icons";
import { Button, Flex, Form, Input, InputNumber, Modal, notification, Progress } from "antd";
import React, { memo, useState } from "react";

let interval: ReturnType<typeof setInterval>;

const CollectDataForm: React.FC = () => {
  const [form] = Form.useForm<DataCollect>();
  const onGenerateReport = useHealthReportStore((state) => state.onGenerateReport);
  const onCancelReport = useHealthReportStore((state) => state.onCancelReport);
  const loading = useHealthReportStore((state) => state.loading);
  const collectedData = useHealthReportStore((state) => state.collectedData);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  const weight = Form.useWatch('weight', form);

  const handleProgress = () => {
    let progress = 0;
    interval = setInterval(() => {
      if(progress < 90){
        progress += 1;
        setProgress(progress);
      }
    }, 500);
  };

  const handleCancelProgress = () => {
    clearInterval(interval);
    setProgress(0);
  };

  const onFinish = async (values: DataCollect) => {
    notification.info({
      message: 'Generating report, estimated time 30s to 3min',
    });
    handleProgress();
    try {
      await onGenerateReport(values);
      setOpen(false);
      notification.success({
        message: 'Report generated successfully',
      });
    } catch (error: any) {
      notification.warning({
        message: error?.message || 'Unknown Gemini error',
      });
    }finally{
      handleCancelProgress();
    }
  };

  const confirm = () => {
    setOpen(false);
    onCancelReport();
  };

  return (
    <Form<DataCollect>
      form={form}
      layout="vertical"
      onFinish={onFinish}
      autoComplete="off"
    >
      {/* Name */}
      <Form.Item
        label="Name"
        name="name"
        initialValue={collectedData?.name}
        rules={[
          { required: true, message: "Please enter your name" },
          {
            validator: (_, value) => {
              if (!regexs.specialCharacter.test(value)) {
                return Promise.reject(
                  "Name should not contain special characters"
                );
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <Input placeholder="Enter your name" />
      </Form.Item>

      {/* Age */}
      <Form.Item
        label="Age"
        name="age"
        initialValue={collectedData?.age}
        rules={[{ required: true, message: "Please enter your age" }]}
      >
        <InputNumber min={1} placeholder="Age" style={{ width: "100%" }} />
      </Form.Item>

      {/* Current Weight */}
      <Form.Item
        label="Current Weight (kg)"
        name="weight"
        initialValue={collectedData?.weight}
        rules={[{ required: true, message: "Please enter your weight" }]}
      >
        <InputNumber min={1} placeholder="Weight" style={{ width: "100%" }} />
      </Form.Item>

      {/* Height */}
      <Form.Item
        label="Height (cm)"
        name="height"
        initialValue={collectedData?.height}
        rules={[{ required: true, message: "Please enter your height" }]}
      >
        <InputNumber min={1} placeholder="Height" style={{ width: "100%" }} />
      </Form.Item>

      {/* Goal Weight */}
      <Form.Item
        label="Goal Weight (kg)"
        name="goalWeight"
        initialValue={collectedData?.goalWeight}
        rules={
          [
            { required: true, message: "Please enter your goal weight" },
            {
              validator: (_, value) => {
                if (value && value === weight) {
                  return Promise.reject("Goal weight must be different from current weight");
                }
                return Promise.resolve();
              },
            },
          ]
        }
      >
        <InputNumber min={1} placeholder="Goal weight" style={{ width: "100%" }} />
      </Form.Item>

      {/* Exercise Time per Day */}
      <Form.Item
        label="Time per Day for Exercise (minutes)"
        name="exerciseTime"
        initialValue={collectedData?.exerciseTime}
        rules={[{ required: true, message: "Please enter exercise time" }]}
      >
        <InputNumber
          min={1}
          placeholder="e.g. 60"
          style={{ width: "100%" }}
          addonAfter="min"
        />
      </Form.Item>

      <Form.Item>
        <Flex justify="center" gap={16}>
          {
            loading && (
              <Button icon={<CloseCircleOutlined />} variant="dashed" color="danger" onClick={() => setOpen(true)} block>
                Cancel
              </Button>
            )
          }
          <Button icon={<FormOutlined />} loading={loading} variant={'solid'} color={'primary'} htmlType="submit" block >
            {loading ? 'Generating report' : 'Generate report'}
          </Button>
        </Flex>
        {!!progress && <Progress percent={progress} />}
      </Form.Item>

      <Modal
        title={<><ExclamationCircleOutlined color="danger" /> Are you sure to cancel generating report?</>}
        open={open}
        onOk={confirm}
        onCancel={() => setOpen(false)}
        okButtonProps={{ danger: true }}
      >
        <p>When you cancel, the report generation process will be stopped.</p>
      </Modal>
    </Form>
  );
};

export default memo(CollectDataForm);
