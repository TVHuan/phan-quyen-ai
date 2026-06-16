import { useEffect, useState } from 'react';
import { Modal, Checkbox, Card, Spin, message, Button, Space, Divider } from 'antd';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

interface PhanQuyenModalProps {
  visible: boolean;
  vaiTro?: VaiTro.IRecord;
  onClose: () => void;
  onSuccess: () => void;
}

interface ChucNangGroup {
  id: string;
  ma: string;
  ten: string;
  children: { id: string; ma: string; ten: string; checked: boolean }[];
}

const PhanQuyenModal = (props: PhanQuyenModalProps) => {
  const { visible, vaiTro, onClose, onSuccess } = props;
  const [groups, setGroups] = useState<ChucNangGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible && vaiTro) fetchData(vaiTro);
  }, [visible, vaiTro]);

  const fetchData = async (vt: VaiTro.IRecord) => {
    setLoading(true);
    try {
      const [treeRes, assignedRes] = await Promise.all([
        axios.get(`${ip3}/chuc-nang/tree`, { params: { phanHeId: vt.phanHeId } }),
        axios.get(`${ip3}/vai-tro/${vt.id}/chuc-nang`),
      ]);

      const tree: ChucNang.IRecord[] = treeRes.data?.data ?? [];
      const assigned: VaiTro.IChucNangAssigned[] = assignedRes.data?.data ?? [];
      const assignedIds = new Set(assigned.map((a) => a.chucNangId));

      const flatGroups: ChucNangGroup[] = [];

      const collectLeafIds = (node: ChucNang.IRecord): string[] => {
        if (!node.children?.length) return [node.id];
        return node.children.flatMap(collectLeafIds);
      };

      for (const root of tree) {
        const group: ChucNangGroup = {
          id: root.id,
          ma: root.ma,
          ten: root.ten,
          children: [],
        };

        if (root.children?.length) {
          for (const child of root.children) {
            group.children.push({
              id: child.id,
              ma: child.ma,
              ten: child.ten,
              checked: assignedIds.has(child.id),
            });
          }
        }

        if (group.children.length > 0) {
          flatGroups.push(group);
        }
      }

      setGroups(flatGroups);
    } catch {
      message.error('Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (groupId: string, childId: string) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              children: g.children.map((c) =>
                c.id === childId ? { ...c, checked: !c.checked } : c,
              ),
            }
          : g,
      ),
    );
  };

  const toggleGroup = (groupId: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        const allChecked = g.children.every((c) => c.checked);
        return {
          ...g,
          children: g.children.map((c) => ({ ...c, checked: !allChecked })),
        };
      }),
    );
  };

  const selectAll = () => {
    setGroups((prev) =>
      prev.map((g) => ({
        ...g,
        children: g.children.map((c) => ({ ...c, checked: true })),
      })),
    );
  };

  const deselectAll = () => {
    setGroups((prev) =>
      prev.map((g) => ({
        ...g,
        children: g.children.map((c) => ({ ...c, checked: false })),
      })),
    );
  };

  const isGroupAllChecked = (group: ChucNangGroup) =>
    group.children.length > 0 && group.children.every((c) => c.checked);

  const isGroupIndeterminate = (group: ChucNangGroup) => {
    const checkedCount = group.children.filter((c) => c.checked).length;
    return checkedCount > 0 && checkedCount < group.children.length;
  };

  const getCheckedIds = (): string[] => {
    return groups.flatMap((g) => g.children.filter((c) => c.checked).map((c) => c.id));
  };

  const handleSave = async () => {
    if (!vaiTro) return;
    setSaving(true);
    try {
      await axios.put(`${ip3}/vai-tro/${vaiTro.id}/chuc-nang`, { chucNangIds: getCheckedIds() });
      message.success('Cập nhật phân quyền thành công');
      onClose();
      onSuccess();
    } catch {
      message.error('Lỗi cập nhật');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={`Phân quyền — ${vaiTro?.ten ?? ''}`}
      open={visible}
      onCancel={onClose}
      width="95vw"
      style={{ top: 20 }}
      bodyStyle={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}
      footer={
        <Space>
          <Button onClick={deselectAll}>Bỏ chọn tất cả</Button>
          <Button onClick={selectAll}>Chọn tất cả</Button>
          <Button type="primary" loading={saving} onClick={handleSave}>Lưu phân quyền</Button>
        </Space>
      }
      destroyOnClose
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: 48 }}><Spin size="large" tip="Đang tải..." /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {groups.map((group) => (
            <Card
              key={group.id}
              size="small"
              title={
                <Checkbox
                  checked={isGroupAllChecked(group)}
                  indeterminate={isGroupIndeterminate(group)}
                  onChange={() => toggleGroup(group.id)}
                  style={{ fontWeight: 600 }}
                >
                  {group.ten}
                </Checkbox>
              }
              styles={{ body: { padding: '8px 12px' } }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {group.children.map((child) => (
                  <Checkbox
                    key={child.id}
                    checked={child.checked}
                    onChange={() => toggleItem(group.id, child.id)}
                  >
                    <span style={{ fontSize: 13 }}>
                      <code style={{ background: '#f5f5f5', padding: '1px 4px', borderRadius: 3, fontSize: 12 }}>
                        {child.ma}
                      </code>
                      <span style={{ marginLeft: 6, color: '#555' }}>{child.ten}</span>
                    </span>
                  </Checkbox>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </Modal>
  );
};

export default PhanQuyenModal;
