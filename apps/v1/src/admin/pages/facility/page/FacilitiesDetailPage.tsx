import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Form, FormItem, Input, Select, Button } from '@plug/ui';
import type { StationDetail } from '../types/facility';
import { fetchStationDetail, patchStation } from '../api/station';
import { useLinesSWR } from '@plug/common-services';
import { FileUploadField } from "@plug/v1/admin/pages/facility/component/FileUploadField";

export default function StationDetail() {
  const { id } = useParams<{ id: string }>();
  const [station, setStation] = useState<StationDetail | null>(null);
  const [formData, setFormData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data: lines } = useLinesSWR();

  useEffect(() => {
    const loadStationDetail = async () => {
      try {
        const response = await fetchStationDetail(Number(id));
        setStation(response.data);
        setFormData({
          id: response.data.facility.id,
          name: response.data.facility.name,
          description: response.data.facility.description,
          code: response.data.facility.code,
          lineIds: response.data.lineIds.map(String),
          createdAt: response.data.facility.createdAt,
          createdBy: response.data.facility.createdBy,
          thumbnail: response.data.facility.thumbnail,
          drawing: response.data.facility.drawing
        });
        console.log(formData)
      } catch (error) {
        console.error('역사 정보를 불러오는데 실패했습니다:', error);
      }
    };

    loadStationDetail();
  }, [id]);

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await patchStation(Number(id));
      const response = await fetchStationDetail(Number(id));
      setStation(response.data);
    } catch (error) {
      console.error('수정 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!station || !formData) return <div className="p-6">로딩 중...</div>;

  return (
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-4">기본 정보</h3>

        <Form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <table className="w-full border-collapse border border-gray-300">
              <tbody>
              <tr>
                <th className="border border-gray-300 p-2 bg-gray-50 w-1/6">역사 ID</th>
                <td className="border border-gray-300 p-2 w-1/3">
                  <FormItem name="id" >
                    <Input.Text
                        placeholder={formData.id}
                        className="w-full"
                        disabled
                    />
                  </FormItem>
                </td>
                <th className="border border-gray-300 p-2 bg-gray-50 w-1/6">역사명</th>
                <td className="border border-gray-300 p-2 w-1/3">
                  <FormItem name="name" required >
                    <Input.Text
                        placeholder={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full"
                    />
                  </FormItem>
                </td>
              </tr>
              <tr>
                <th className="border border-gray-300 p-2 bg-gray-50">설명</th>
                <td className="border border-gray-300 p-2">
                  <FormItem name="description" required >
                    <Input.Text
                        placeholder={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="w-full"
                    />
                  </FormItem>
                </td>
                <th className="border border-gray-300 p-2 bg-gray-50">코드</th>
                <td className="border border-gray-300 p-2">
                  <FormItem name="code" >
                    <Input.Text placeholder={formData.code} className="w-full" disabled/>
                  </FormItem>
                </td>
              </tr>
              <tr>
                <th className="border border-gray-300 p-2 bg-gray-50">노선</th>
                <td className="border border-gray-300 p-2" colSpan={3}>
                  <p>
                    {formData.lineIds}
                  </p>
                  <FormItem name="lineIds" required >
                    <Select
                        type="multiple"
                        className="w-full"
                        onChange={(value) => handleInputChange('lineIds', value)}
                    >
                      <Select.Trigger />
                      <Select.Content>
                        {lines?.map((line) => (
                            <Select.Item key={line.id} value={String(line.id)}>
                              {line.name}
                            </Select.Item>
                        ))}
                      </Select.Content>
                    </Select>
                  </FormItem>
                </td>
              </tr>
              <tr>
                <th className="border border-gray-300 p-2 bg-gray-50">생성일</th>
                <td className="border border-gray-300 p-2">
                  <FormItem name="createdAt" >
                    <Input.Text
                        placeholder={formData.createdAt}
                        className="w-full"
                        disabled
                    />
                  </FormItem>
                </td>
                <th className="border border-gray-300 p-2 bg-gray-50">생성자</th>
                <td className="border border-gray-300 p-2">
                  <FormItem name="createdBy" >
                    <Input.Text
                        placeholder={formData.createdBy}
                        className="w-full"
                        disabled
                    />
                  </FormItem>
                </td>
              </tr>
              </tbody>
            </table>


            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium mb-2">썸네일 이미지</p>
                {station.facility.thumbnail?.url && (
                    <div className="w-full h-48 mb-3 rounded-lg overflow-hidden">
                      <img
                          src={station.facility.thumbnail.url}
                          alt="썸네일 이미지"
                          className="w-full h-full object-cover"
                      />
                    </div>
                )}
              </div>
              <div>
                <FileUploadField
                    type="thumbnail"
                    label="썸네일 파일"
                    fileState={{
                      file: station.facility.thumbnail as unknown as File,
                      fileId: station.facility.thumbnail.id
                    }}
                    isUploading={false}
                    onChange={(e) => console.log(e)}
                    onOpenPicker={() => {
                    }}
                />
                <FileUploadField
                    type="model"
                    label="3D 모델 파일"
                    fileState={{file: station.facility.drawing as unknown as File, fileId: station.facility.drawing.id}}
                    isUploading={false}
                    onChange={(e) => console.log(e)}
                    onOpenPicker={() => {
                    }}
                />
              </div>
          </div>

            <div className="flex justify-center gap-2 mt-6">
              <Button type="submit" color="primary" disabled={isLoading} isLoading={isLoading}>
                저장
              </Button>
            </div>

        </div>
      </Form>
    </div>
  );
}