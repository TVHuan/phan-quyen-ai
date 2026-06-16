declare namespace PhanHe {
  export interface IRecord {
    id: string;
    ma: string;
    ten: string;
    moTa?: string;
    trangThai: boolean;
    createdAt?: string;
    updatedAt?: string;
  }
}

declare namespace ChucNang {
  export interface IRecord {
    id: string;
    ma: string;
    ten: string;
    moTa?: string;
    thuTu: number;
    trangThai: boolean;
    phanHeId: string;
    parentId?: string;
    parent?: IRecord;
    children?: IRecord[];
    createdAt?: string;
    updatedAt?: string;
  }
}

declare namespace VaiTro {
  export interface IRecord {
    id: string;
    ma: string;
    ten: string;
    moTa?: string;
    macDinh: boolean;
    trangThai: boolean;
    phanHeId: string;
    createdAt?: string;
    updatedAt?: string;
  }

  export interface IChucNangAssigned {
    vaiTroId: string;
    chucNangId: string;
    chucNang: ChucNang.IRecord;
  }
}

declare namespace NguoiDungVaiTro {
  export interface IRecord {
    nguoiDungId: string;
    vaiTroId: string;
    phanHeId: string;
    vaiTro?: VaiTro.IRecord;
    phanHe?: PhanHe.IRecord;
  }
}

declare namespace PhanQuyen {
  export interface IPermission {
    scopes: string[];
    rsname: string;
  }
}
