import axios from '@/utils/axios';
import {
	ip3,
	ipNotif,
} from '@/utils/ip';
import type { ESettingKey } from './constant';
import type { ISetting } from './typing';

export async function getUserInfo() {
	return axios.get(`${ip3}/users/me`);
}

export async function authLogin(payload: { username: string; password: string }) {
	return axios.post(`${ip3}/auth/login`, payload);
}

export async function authRegister(payload: { username: string; password: string; email?: string; firstName?: string; lastName?: string }) {
	return axios.post(`${ip3}/auth/register`, payload);
}

export async function getUserPermissions(phanHeId?: string) {
	return axios.get(`${ip3}/phan-quyen/me`, { params: { phanHeId } });
}

export async function getChucNangTree(phanHeId: string) {
	return axios.get(`${ip3}/chuc-nang/tree`, { params: { phanHeId } });
}

export async function getVaiTroChucNang(vaiTroId: string) {
	return axios.get(`${ip3}/vai-tro/${vaiTroId}/chuc-nang`);
}

export async function updateVaiTroChucNang(vaiTroId: string, chucNangIds: string[]) {
	return axios.put(`${ip3}/vai-tro/${vaiTroId}/chuc-nang`, { chucNangIds });
}

export async function getNguoiDungVaiTro(userId: string, phanHeId?: string) {
	return axios.get(`${ip3}/phan-quyen/nguoi-dung/${userId}/vai-tro`, { params: { phanHeId } });
}

export async function updateNguoiDungVaiTro(userId: string, phanHeId: string, vaiTroIds: string[]) {
	return axios.put(`${ip3}/phan-quyen/nguoi-dung/${userId}/vai-tro`, { phanHeId, vaiTroIds });
}

export async function initOneSignal(payload: { playerId: string }) {
	return axios.put(`${ipNotif}/one-signal/user`, payload);
}

export async function deleteOneSignal(data: { playerId: any }) {
	return axios.delete(`${ipNotif}/one-signal/user`, { data });
}

// Cài đặt

export async function getSettingByKey(key: ESettingKey, ip?: string) {
	return axios.get(`${ip ?? ip3}/setting/${key}/value`);
}

export async function putSetting(data: ISetting, ip?: string) {
	return axios.put(`${ip ?? ip3}/setting/value`, data);
}

export async function getByKey(key: ESettingKey, ip?: string) {
	return axios.get(`${ip ?? ip3}/setting/one`, { params: { condition: { key: key } } });
}

export async function updateSetting(id: string, payload: { key: ESettingKey; value: any }, ip?: string) {
	return axios.put(`${ip ?? ip3}/setting/${id}`, payload);
}

export async function createSetting(payload: { key: ESettingKey; value: any }, ip?: string) {
	return axios.post(`${ip ?? ip3}/setting`, payload);
}
