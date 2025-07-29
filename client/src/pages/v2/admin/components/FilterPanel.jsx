'use client';
import { Card, Tabs, Select, Radio, Checkbox, Button, Typography } from 'antd';

const { TabPane } = Tabs;
const { Option } = Select;
const { Text } = Typography;

const FilterPanel = ({
  institutions,
  filters,
  setFilters,
  advancedSearch,
  setAdvancedSearch,
  advancedFilters,
  setAdvancedFilters,
  onClose,
}) => {
  return (
    <Card className="mb-4">
      <Tabs defaultActiveKey="basic">
        <TabPane tab="Basic Filters" key="basic">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Text strong>Institution Type</Text>
              <Select
                mode="multiple"
                allowClear
                style={{ width: '100%', marginTop: '8px' }}
                placeholder="Filter by type"
                value={filters.type}
                onChange={(values) => setFilters({ ...filters, type: values })}
                maxTagCount={2}
              >
                {Array.from(
                  new Set(institutions?.map((i) => i.type) || [])
                ).map((type) => (
                  <Option key={type} value={type}>
                    {type}
                  </Option>
                ))}
              </Select>
            </div>

            <div>
              <Text strong>City</Text>
              <Select
                mode="multiple"
                allowClear
                style={{ width: '100%', marginTop: '8px' }}
                placeholder="Filter by city"
                value={filters.city}
                onChange={(values) => setFilters({ ...filters, city: values })}
                maxTagCount={2}
              >
                {Array.from(
                  new Set(institutions?.map((i) => i.location?.city) || [])
                )
                  .filter(Boolean)
                  .map((city) => (
                    <Option key={city} value={city}>
                      {city}
                    </Option>
                  ))}
              </Select>
            </div>

            <div>
              <Text strong>Status</Text>
              <div className="mt-2">
                <Radio.Group
                  value={filters.featured}
                  onChange={(e) =>
                    setFilters({ ...filters, featured: e.target.value })
                  }
                  buttonStyle="solid"
                >
                  <Radio.Button value={null}>All</Radio.Button>
                  <Radio.Button value={true}>Featured</Radio.Button>
                  <Radio.Button value={false}>Standard</Radio.Button>
                </Radio.Group>
              </div>
            </div>
          </div>
        </TabPane>

        <TabPane tab="Advanced Filters" key="advanced">
          <div className="mb-4">
            <Checkbox
              checked={advancedSearch}
              onChange={(e) => setAdvancedSearch(e.target.checked)}
            >
              Enable Advanced Filters
            </Checkbox>
          </div>

          <div
            className={`space-y-4 ${
              !advancedSearch && 'opacity-50 pointer-events-none'
            }`}
          >
            <div>
              <Text strong>Established Year Range</Text>
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>1900</span>
                  <span>2024</span>
                </div>
              </div>
            </div>

            <div>
              <Text strong>Program Count Range</Text>
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0</span>
                  <span>100+</span>
                </div>
              </div>
            </div>
          </div>
        </TabPane>
      </Tabs>

      <div className="flex justify-end mt-4">
        <Button
          onClick={() => {
            setFilters({
              type: [],
              city: [],
              featured: null,
            });
            setAdvancedFilters({
              establishedYearRange: [1900, 2024],
              programCount: [0, 100],
              rankings: [],
            });
            setAdvancedSearch(false);
          }}
          className="mr-2"
        >
          Reset All Filters
        </Button>
        <Button type="primary" onClick={onClose}>
          Apply Filters
        </Button>
      </div>
    </Card>
  );
};

export default FilterPanel;
