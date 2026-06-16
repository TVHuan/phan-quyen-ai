import { Button, Popconfirm, Select, Space, Table, Tag, Tooltip, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect, useState, useCallback } from 'react';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import Form from './components/Form';
import type { ColumnsType } from 'antd/es/table';

const ChucNangPage = () => {
  const [phanHeId, setPhanHeId] = useState<string>();
  const [phanHeList, setPhanHeList] = useState<PhanHe.IRecord[]>([]);
  const [treeData, setTreeData] = useState<ChucNang.IRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [formEdit, setFormEdit] = useState(false);
  const [formRecord, setFormRecord] = useState<ChucNang.IRecord | undefined>();

  const fetchPhanHe = useCallback(async () => {
    try {
      const res = await axios.get(`${ip3}/phan-he/all`);
      const list: PhanHe.IRecord[] = res.data?.data ?? [];
      setPhanHeList(list);
      if (list.length && !phanHeId) setPhanHeId(list[0].id);
    } catch {}
  }, []);

  const fetchTree = useCallback(async () => {
    if (!phanHeId) return;
    setLoading(true);
    try {
      const res = await axios.get(`${ip3}/chuc-nang/tree`, { params: { phanHeId } });
      setTreeData(res.data?.data ?? []);
    } catch {
      setTreeData([]);
    } finally {
      setLoading(false);
    }
  }, [phanHeId]);

  useEffect(() => { fetchPhanHe(); }, [fetchPhanHe]);
  useEffect(() => { fetchTree(); }, [fetchTree]);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${ip3}/chuc-nang/${id}`);
      message.success('Xóa thành công');
      fetchTree();
    } catch {}
  };

  const openAdd = () => {
    setFormRecord(undefined);
    setFormEdit(false);
    setFormVisible(true);
  };

  const openEdit = (record: ChucNang.IRecord) => {
    setFormRecord(record);
    setFormEdit(true);
    setFormVisible(true);
  };

  const columns: ColumnsType<ChucNang.IRecord> = [
    { title: 'Mã chức năng', dataIndex: 'ma', key: 'ma', width: 220, render: (_, rec) => (
      <span style={{ paddingLeft: rec.parentId ? 24 : 0 }}>{rec.ma}</span>
    )},
    { title: 'Tên chức năng', dataIndex: 'ten', key: 'ten', width: 280 },
    { title: 'Mô tả', dataIndex: 'moTa', key: 'moTa', ellipsis: true },
    {
      title: 'Trạng thái', dataIndex: 'trangThai', key: 'trangThai', width: 100, align: 'center',
      render: (val: boolean) => val ? <Tag color="green">On</Tag> : <Tag color="red">Off</Tag>,
    },
    {
      title: 'Thao tác', key: 'action', width: 120, align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <Button type="link" size="small" icon={<EditOutlined />} onClick={() => openEdit(record)} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm title="Xóa chức năng này?" onConfirm={() => handleDelete(record.id)} placement="topLeft">
              <Button danger type="link" size="small" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Select placeholder="Chọn phân hệ" style={{ width: 300 }} value={phanHeId} onChange={(v) => setPhanHeId(v)}
          options={phanHeList.map((p) => ({ label: `${p.ma} — ${p.ten}`, value: p.id }))} />
        {phanHeId && (
          <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>Thêm chức năng</Button>
        )}
      </Space>
      <Table columns={columns} dataSource={treeData} rowKey="id" loading={loading} pagination={false}
        defaultExpandAllRows size="middle" />
      <Form visible={formVisible} edit={formEdit} record={formRecord}
        phanHeId={phanHeId} phanHeList={phanHeList} treeData={treeData}
        onClose={() => setFormVisible(false)} onSuccess={fetchTree} />
    </div>
  );
};

export default ChucNangPage;
