import { Button, Form, Input, Modal, Popconfirm, Select, Space, Switch, Table, Tag, Tooltip, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useEffect, useState, useCallback } from 'react';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import rules from '@/utils/rules';
import { formatDateTime } from '@/utils/formatDate';
import PhanQuyenModal from './components/PhanQuyenModal';
import type { ColumnsType } from 'antd/es/table';

const VaiTroPage = () => {
  const [data, setData] = useState<VaiTro.IRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [phanHeList, setPhanHeList] = useState<PhanHe.IRecord[]>([]);
  const [phanHeId, setPhanHeId] = useState<string>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<VaiTro.IRecord | null>(null);
  const [form] = Form.useForm();
  const [submiting, setSubmiting] = useState(false);
  const [phanQuyenVisible, setPhanQuyenVisible] = useState(false);
  const [selectedVaiTro, setSelectedVaiTro] = useState<VaiTro.IRecord>();

  const fetchPhanHe = useCallback(async () => {
    try {
      const res = await axios.get(`${ip3}/phan-he/all`);
      const list: PhanHe.IRecord[] = res.data?.data ?? [];
      setPhanHeList(list);
      if (list.length && !phanHeId) setPhanHeId(list[0].id);
    } catch {}
  }, []);

  const fetchData = useCallback(async () => {
    if (!phanHeId) return;
    setLoading(true);
    try {
      const res = await axios.get(`${ip3}/vai-tro/all`, { params: { phanHeId } });
      setData(res.data?.data ?? []);
    } catch { setData([]); }
    finally { setLoading(false); }
  }, [phanHeId]);

  useEffect(() => { fetchPhanHe(); }, [fetchPhanHe]);
  useEffect(() => { fetchData(); }, [fetchData]);

  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ phanHeId, macDinh: false, trangThai: true });
    setModalOpen(true);
  };

  const openEdit = (r: VaiTro.IRecord) => {
    setEditing(r);
    form.setFieldsValue(r);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try { await axios.delete(`${ip3}/vai-tro/${id}`); message.success('Đã xóa'); fetchData(); } catch {}
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmiting(true);
      if (editing) {
        await axios.put(`${ip3}/vai-tro/${editing.id}`, values);
      } else {
        await axios.post(`${ip3}/vai-tro`, values);
      }
      message.success(editing ? 'Đã cập nhật' : 'Đã thêm');
      setModalOpen(false);
      fetchData();
    } catch {} finally { setSubmiting(false); }
  };

  const columns: ColumnsType<VaiTro.IRecord> = [
    { title: 'Mã', dataIndex: 'ma', width: 120 },
    { title: 'Tên vai trò', dataIndex: 'ten', width: 200 },
    { title: 'Mô tả', dataIndex: 'moTa', width: 280, ellipsis: true },
    { title: 'Mặc định', dataIndex: 'macDinh', width: 90, align: 'center',
      render: (v: boolean) => v ? <Tag color="blue">Mặc định</Tag> : <Tag>—</Tag> },
    { title: 'Trạng thái', dataIndex: 'trangThai', width: 90, align: 'center',
      render: (v: boolean) => v ? <Tag color="green">On</Tag> : <Tag color="red">Off</Tag> },
    { title: 'Ngày tạo', dataIndex: 'createdAt', width: 150, align: 'center',
      render: (v: string) => formatDateTime(v) },
    { title: 'Thao tác', width: 160, align: 'center',
      render: (_, r) => (
        <Space>
          <Tooltip title="Phân quyền"><Button type="link" size="small" icon={<SafetyCertificateOutlined />}
            onClick={() => { setSelectedVaiTro(r); setPhanQuyenVisible(true); }} /></Tooltip>
          <Tooltip title="Sửa"><Button type="link" size="small" icon={<EditOutlined />} onClick={() => openEdit(r)} /></Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm title="Xóa vai trò này?" onConfirm={() => handleDelete(r.id)}>
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
        <Select placeholder="Chọn phân hệ" style={{ width: 300 }} value={phanHeId}
          onChange={(v) => setPhanHeId(v)}
          options={phanHeList.map(p => ({ label: `${p.ma} — ${p.ten}`, value: p.id }))} />
        {phanHeId && <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>Thêm vai trò</Button>}
      </Space>
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading}
        pagination={{ pageSize: 20 }} size="middle" />
      <Modal title={(editing ? 'Sửa ' : 'Thêm ') + 'vai trò'} open={modalOpen}
        onCancel={() => setModalOpen(false)} onOk={handleSubmit} confirmLoading={submiting} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="phanHeId" label="Phân hệ" rules={[...rules.required]}>
            <Select options={phanHeList.map(p => ({ label: `${p.ma} — ${p.ten}`, value: p.id }))} />
          </Form.Item>
          <Form.Item name="ma" label="Mã" rules={[...rules.required, ...rules.length(100)]}>
            <Input placeholder="VD: admin" />
          </Form.Item>
          <Form.Item name="ten" label="Tên" rules={[...rules.required, ...rules.length(255)]}>
            <Input placeholder="Tên vai trò" />
          </Form.Item>
          <Form.Item name="moTa" label="Mô tả"><Input.TextArea rows={3} /></Form.Item>
          <Form.Item name="macDinh" label="Mặc định" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="trangThai" label="Trạng thái" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
      <PhanQuyenModal visible={phanQuyenVisible} vaiTro={selectedVaiTro}
        onClose={() => setPhanQuyenVisible(false)} onSuccess={fetchData} />
    </>
  );
};

export default VaiTroPage;
