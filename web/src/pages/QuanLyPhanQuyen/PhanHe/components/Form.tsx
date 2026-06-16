import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Form, Input, Switch } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormPhanHe = () => {
  const [form] = Form.useForm();
  const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
    useModel('quanlyphanquyen.phanhe');

  useEffect(() => {
    if (!visibleForm) resetFieldsForm(form);
    else if (record?.id) form.setFieldsValue(record);
  }, [record?.id, visibleForm]);

  const onFinish = (values: any) => {
    if (edit) {
      putModel(record?.id ?? '', values).catch((er) => console.log(er));
    } else {
      postModel(values).then(() => form.resetFields()).catch((er) => console.log(er));
    }
  };

  return (
    <Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + 'phân hệ'}>
      <Form onFinish={onFinish} form={form} layout="vertical">
        <Form.Item name="ma" label="Mã phân hệ" rules={[...rules.required, ...rules.length(100)]}>
          <Input placeholder="VD: ai-mo-phong" />
        </Form.Item>
        <Form.Item name="ten" label="Tên phân hệ" rules={[...rules.required, ...rules.length(255)]}>
          <Input placeholder="Tên phân hệ" />
        </Form.Item>
        <Form.Item name="moTa" label="Mô tả">
          <Input.TextArea rows={3} placeholder="Mô tả ngắn về phân hệ" />
        </Form.Item>
        <Form.Item name="trangThai" label="Trạng thái" valuePropName="checked" initialValue={true}>
          <Switch checkedChildren="Hoạt động" unCheckedChildren="Tạm dừng" />
        </Form.Item>
        <div className="form-footer">
          <Button loading={formSubmiting} htmlType="submit" type="primary">
            {!edit ? 'Thêm mới' : 'Lưu lại'}
          </Button>
          <Button onClick={() => setVisibleForm(false)}>Hủy</Button>
        </div>
      </Form>
    </Card>
  );
};

export default FormPhanHe;
