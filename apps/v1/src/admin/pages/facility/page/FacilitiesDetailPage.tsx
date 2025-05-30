import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Form, FormItem, Input, Select, Button } from '@plug/ui';
import type { StationDetail } from '../types/facility';
import { fetchStationDetail, patchStation } from '../api/station';
import { useLinesSWR } from '@plug/common-services';
import { FileUploadField } from "@plug/v1/admin/pages/facility/component/FileUploadField";
import DateFormatter from "@plug/v1/app/utils/dateFormatter";

type FormValues = {
  name: string;
  description: string;
  code: string;
  lineIds: string[];
  updatedBy: string;
  id: string;
  updatedAt: string;
  floors: Array<{ name: string; floorId: string }>;
  externalCode: string;
};

export default function StationDetail() {
  const { id } = useParams<{ id: string }>();
  const [station, setStation] = useState<StationDetail | null>(null);
  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    code: '',
    lineIds: [] as string[],
    updatedBy: '',
    id: '',
    updatedAt: '',
    floors: [] as Array<{ name: string; floorId: string }>,
    externalCode: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { data: lines } = useLinesSWR();

  useEffect(() => {
    const loadStationDetail = async () => {
      try {
        const response = await fetchStationDetail(Number(id));
        setStation(response.data);
        setFormValues({
          name: response.data.facility.name,
          description: response.data.facility.description,
          code: response.data.facility.code || '',
          lineIds: response.data.lineIds.map(String),
          updatedBy: response.data.facility.updatedBy,
          id: response.data.facility.id.toString(),
          updatedAt: DateFormatter(response.data.facility.updatedAt),
          floors: response.data.floors.map((floor) => ({name: floor.name, floorId: String(floor.floorId)})),
          externalCode: response.data.externalCode || '',
        });
      } catch (error) {
        console.error('역사 정보를 불러오는데 실패했습니다:', error);
      }
    };

    loadStationDetail();
  }, [id]);

  const handleChange = (name: string, value: string | string[]) => {
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const updateData = {
        facility: {
          name: formValues.name,
          description: formValues.description,
          code: formValues.code,
        },
        lineIds: formValues.lineIds.map(Number),
        floors: formValues.floors.map(floor => ({
          name: floor.name,
          floorId: Number(floor.floorId)
        })),
        externalCode: formValues.externalCode,
      };

      await patchStation({
        id: Number(id),
        ...updateData
      });

      const response = await fetchStationDetail(Number(id));
      setStation(response.data);
      setFormValues({
        name: response.data.facility.name,
        description: response.data.facility.description,
        code: response.data.facility.code || '',
        lineIds: response.data.lineIds.map(String),
        updatedBy: response.data.facility.updatedBy,
        id: String(response.data.facility.id),
        updatedAt: response.data.facility.updatedAt,
        floors: response.data.floors.map((floor) => ({
          name: floor.name,
          floorId: String(floor.floorId)
        })),
        externalCode: response.data.externalCode || '',
      });
    } catch (error) {
      console.error('수정 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!station) return <div className="p-6">로딩 중...</div>;

  return (
    <div className="p-6">
      <Form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <table className="w-full border-collapse border border-gray-300">
            <tbody>
              <tr>
                <th className="border border-gray-300 p-2 bg-gray-50 w-1/6">역사 ID</th>
                <td className="border border-gray-300 p-2 w-1/3">
                  <FormItem name="id" >
                    <div>
                      <Input.Text
                          value={formValues.id}
                          onChange={(value) => handleChange('id', value)}
                          className="w-full"
                          disabled
                      />
                    </div>
                  </FormItem>
                </td>
                <th className="border border-gray-300 p-2 bg-gray-50 w-1/6">역사명</th>
                <td className="border border-gray-300 p-2 w-1/3">
                  <FormItem name="name" required >
                    <div>
                      <Input.Text
                          placeholder={formValues.name}
                          value={formValues.name}
                          onChange={(value) => handleChange('name', value)}
                          className="w-full"
                      />
                    </div>

                  </FormItem>
                </td>
              </tr>
              <tr>
                <th className="border border-gray-300 p-2 bg-gray-50">설명</th>
                <td className="border border-gray-300 p-2">
                  <FormItem name="description" required >
                    <div>
                      <Input.Text
                          value={formValues.description}
                          onChange={(e) => handleChange('description', e)}
                          className="w-full"
                      />
                    </div>
                  </FormItem>
                </td>
                <th className="border border-gray-300 p-2 bg-gray-50">코드</th>
                <td className="border border-gray-300 p-2">
                  <FormItem name="code" >
                    <div>
                      <Input.Text
                          value={formValues.code}
                          onChange={(e) => handleChange('code', e)}
                          className="w-full"
                          disabled
                      />
                    </div>
                  </FormItem>
                </td>
              </tr>
              <tr>
                <th className="border border-gray-300 p-2 bg-gray-50">노선</th>
                <td className="border border-gray-300 p-2">
                  <FormItem name="lineIds" required >
                    <Select
                      type="multiple"
                      className="w-full"
                      selected={formValues.lineIds}
                      onChange={(value) => handleChange('lineIds', value)}
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
                <th className="border border-gray-300 p-2 bg-gray-50">외부 코드</th>
                <td className="border border-gray-300 p-2">
                  <FormItem name="externalCode" >
                    <div>
                      <Input.Text
                          value={formValues.externalCode}
                          onChange={(e) => handleChange('code', e)}
                          className="w-full"
                      />
                    </div>
                  </FormItem>
                </td>
              </tr>
              <tr>
                <th className="border border-gray-300 p-2 bg-gray-50">층 정보</th>
                <td className="border border-gray-300 p-2" colSpan={3}>
                  <FormItem name="floors" required>
                    <div className="space-y-2">
                      {formValues.floors.map((floor) => (
                          <div key={floor.floorId} className="flex gap-2">
                            <p>{floor.name}</p>
                          </div>
                      ))}
                    </div>
                  </FormItem>
                </td>
              </tr>
              <tr>
                <th className="border border-gray-300 p-2 bg-gray-50">수정일</th>
                <td className="border border-gray-300 p-2">
                  <FormItem name="updatedAt" >
                    <div>
                      <Input.Text
                          value={formValues.updatedAt}
                          onChange={(e) => handleChange('updatedAt', e)}
                          className="w-full"
                          disabled
                      />
                    </div>
                  </FormItem>
                </td>
                <th className="border border-gray-300 p-2 bg-gray-50">마지막 수정인</th>
                <td className="border border-gray-300 p-2">
                  <FormItem name="updatedBy" >
                    <div>
                      <Input.Text
                          value={formValues.updatedBy}
                          onChange={(e) => handleChange('updatedBy', e)}
                          className="w-full"
                          disabled
                      />
                    </div>
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
                      fileId: station.facility.thumbnail.id,
                      originalFileName: station.facility.thumbnail.originalFileName
                    }}
                    isUploading={false}
                    onChange={(e) => console.log(e)}
                    onOpenPicker={() => {
                    }}
                />
                <FileUploadField
                    type="model"
                    label="3D 모델 파일"
                    fileState={{
                      file: station.facility.drawing as unknown as File,
                      fileId: station.facility.drawing.id,
                      originalFileName: station.facility.drawing.originalFileName
                    }}
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
              <Button type="button" color="destructive" disabled={isLoading} isLoading={isLoading}>
                삭제
              </Button>
            </div>

        </div>
      </Form>
    </div>
  );
}