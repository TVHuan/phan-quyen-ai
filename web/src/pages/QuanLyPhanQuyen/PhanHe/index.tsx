import { Button, Form, Input, Modal, Popconfirm, Space, Switch, Table, Tag, Tooltip, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect, useState, useCallback } from 'react';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import rules from '@/utils/rules';
import { formatDateTime } from '@/utils/formatDate';
import type { ColumnsType } from 'antd/es/table';

const PhanHePage = () => {
  const [data, setData] = useState<PhanHe.IRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PhanHe.IRecord | null>(null);
  const [form] = Form.useForm();
  const [submiting, setSubmiting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${ip3}/phan-he/all`);
      setData(res.data?.data ?? []);
    } catch { setData([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ trangThai: true });
    setModalOpen(true);
  };

  const openEdit = (r: PhanHe.IRecord) => {
    setEditing(r);
    form.setFieldsValue(r);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try { await axios.delete(`${ip3}/phan-he/${id}`); message.success('Đã xóa'); fetchData(); } catch {}
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmiting(true);
      if (editing) {
        await axios.put(`${ip3}/phan-he/${editing.id}`, values);
      } else {
        await axios.post(`${ip3}/phan-he`, values);
      }
      message.success(editing ? 'Đã cập nhật' : 'Đã thêm');
      setModalOpen(false);
      fetchData();
    } catch {} finally { setSubmiting(false); }
  };

  const columns: ColumnsType<PhanHe.IRecord> = [
    { title: 'Mã', dataIndex: 'ma', width: 150 },
    { title: 'Tên phân hệ', dataIndex: 'ten', width: 250 },
    { title: 'Mô tả', dataIndex: 'moTa', width: 280, ellipsis: true },
    { title: 'Trạng thái', dataIndex: 'trangThai', width: 100, align: 'center',
      render: (v: boolean) => v ? <Tag color="green">On</Tag> : <Tag color="red">Off</Tag> },
    { title: 'Ngày tạo', dataIndex: 'createdAt', width: 150, align: 'center',
      render: (v: string) => formatDateTime(v) },
    { title: 'Thao tác', width: 100, align: 'center',
      render: (_, r) => (
        <Space>
          <Tooltip title="Sửa"><Button type="link" size="small" icon={<EditOutlined />} onClick={() => openEdit(r)} /></Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm title="Xóa phân hệ này?" onConfirm={() => handleDelete(r.id)}>
              <Button danger type="link" size="small" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>Thêm phân hệ</Button>
      </Space>
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading} size="middle" />
      <Modal title={(editing ? 'Sửa ' : 'Thêm ') + 'phân hệ'} open={modalOpen}
        onCancel={() => setModalOpen(false)} onOk={handleSubmit} confirmLoading={submiting} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="ma" label="Mã" rules={[...rules.required, ...rules.length(100)]}>
            <Input placeholder="VD: ai-mo-phong" />
          </Form.Item>
          <Form.Item name="ten" label="Tên" rules={[...rules.required, ...rules.length(255)]}>
            <Input placeholder="Tên phân hệ" />
          </Form.Item>
          <Form.Item name="moTa" label="Mô tả"><Input.TextArea rows={3} /></Form.Item>
          <Form.Item name="trangThai" label="Trạng thái" valuePropName="checked">
            <Switch checkedChildren="On" unCheckedChildren="Off" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default PhanHePage;
