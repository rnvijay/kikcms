<?php

namespace KikCMS\Services\DataTable;


use KikCMS\Classes\DataTable\DataTableFilters;
use KikCMS\Classes\DataTable\Filter\FilterSelect;
use KikCMS\Models\User;
use KikCMS\Services\ModelService;
use KikCmsCore\Config\DbConfig;
use Phalcon\Mvc\Model\Query\Builder;
use Phalcon\Mvc\Model\Relation;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;

class DataTableFilterServiceTest extends TestCase
{
    public function testAddCustomFilters()
    {
        $dataTableFilterService = new DataTableFilterService();

        $filters = (new DataTableFilters);
        $query   = (new Builder);

        $dataTableFilterService->addCustomFilters($query, $filters, []);

        // test no filters
        $this->assertNull($query->getWhere());

        $filters->setCustomFilterValues(['key1' => null]);

        $customFilter = ['testField' => new FilterSelect('testField', 'testLabel', ['value1' => 'valueLabel1'])];

        $dataTableFilterService->addCustomFilters($query, $filters, $customFilter);

        // test empty value filter
        $this->assertNull($query->getWhere());

        $filters->setCustomFilterValues(['testField' => 'value1']);

        $dataTableFilterService->addCustomFilters($query, $filters, $customFilter);

        // test we have a where
        $this->assertNotNull($query->getWhere());
    }

    public function testAddSearchFilter()
    {
        $dataTableFilterService = new DataTableFilterService();

        $filters = (new DataTableFilters);
        $query   = (new Builder);

        $dataTableFilterService->addSearchFilter($query, $filters, []);

        // test no search
        $this->assertNull($query->getWhere());

        $filters->setSearch('searchValue');

        $dataTableFilterService->addSearchFilter($query, $filters, ['field']);

        // test single search
        $this->assertEquals('field LIKE "%searchValue%"', $query->getWhere());

        $query = (new Builder);

        // test multi search
        $dataTableFilterService->addSearchFilter($query, $filters, ['field1', 'field2']);

        $this->assertEquals('field1 LIKE "%searchValue%" OR field2 LIKE "%searchValue%"', $query->getWhere());
    }

    public function testAddSortFilter()
    {
        $dataTableFilterService = new DataTableFilterService();

        $filters = (new DataTableFilters);
        $query   = (new Builder);

        $dataTableFilterService->addSortFilter($query, $filters, false, '');

        // test no sort
        $this->assertNull($query->getWhere());

        $dataTableFilterService->addSortFilter($query, $filters, true, 'display_order');

        // test default sort
        $this->assertEquals('display_order asc', $query->getOrderBy());

        $filters->setSortColumn('field');
        $filters->setSortDirection(DbConfig::SQL_SORT_ASCENDING);

        $dataTableFilterService->addSortFilter($query, $filters, false, '');

        // test sort sort
        $this->assertEquals('field asc', $query->getOrderBy());
    }

    public function testAddSubDataTableFilter()
    {
        $dataTableFilterServiceMock = $this->getMock(['hasParent']);
        $dataTableFilterServiceMock->method('hasParent')->willReturn(false);

        $filters = (new DataTableFilters);
        $query   = (new Builder);

        $dataTableFilterServiceMock->addSubDataTableFilter($query, $filters, [], 'id');

        // test nothing
        $this->assertNull($query->getWhere());

        $dataTableFilterServiceMock = $this->getMock(['hasParent', 'getParentRelationKey', 'getParentRelationValue']);
        $dataTableFilterServiceMock->method('hasParent')->willReturn(true);
        $dataTableFilterServiceMock->method('getParentRelationKey')->willReturn('key');
        $dataTableFilterServiceMock->method('getParentRelationValue')->willReturn('value');

        $dataTableFilterServiceMock->addSubDataTableFilter($query, $filters, [], 'id');

        // test with parent
        $this->assertEquals('key = value', $query->getWhere());

        $query = (new Builder);
        $filters->setParentEditId(0);

        $dataTableFilterServiceMock->addSubDataTableFilter($query, $filters, [1,2,3], 'id');

        // test with unset parent
        $this->assertEquals('(key = value) AND (id IN (:AP0:, :AP1:, :AP2:))', $query->getWhere());
    }

    public function testGetParentRelationValue()
    {
        $dataTableFilterService = new DataTableFilterService();
        $filters                = (new DataTableFilters)->setParentEditId(0);

        $this->assertEquals(0, $dataTableFilterService->getParentRelationValue($filters));

        $filters = (new DataTableFilters)
            ->setLanguageCode('nl')
            ->setParentModel(User::class)
            ->setParentEditId(1)
            ->setParentRelationKey('relationKey');

        $relation = new Relation(0, User::class, 'field', 'fieldRef');

        $userMock = $this->createMock(User::class);

        $modelServiceMock = $this->createMock(ModelService::class);
        $modelServiceMock->expects($this->once())->method('getRelation')->willReturn($relation);
        $modelServiceMock->expects($this->once())->method('getObject')->willReturn($userMock);

        $dataTableFilterService->modelService = $modelServiceMock;

        $userMock->expects($this->once())->method('__get');

        $dataTableFilterService->getParentRelationValue($filters);
    }

    public function testGetParentRelationKey()
    {
        $dataTableFilterService = new DataTableFilterService();
        $filters                = new DataTableFilters;

        $this->assertNull($dataTableFilterService->getParentRelationKey($filters));

        $filters->setParentModel(User::class);
        $filters->setParentRelationKey('relationKey');

        $modelServiceMock = $this->createMock(ModelService::class);
        $modelServiceMock->expects($this->once())->method('getRelation')->willReturn(null);

        $dataTableFilterService->modelService = $modelServiceMock;

        $this->assertNull($dataTableFilterService->getParentRelationKey($filters));

        $relation = new Relation(Relation::HAS_ONE, User::class, [], []);

        $modelServiceMock = $this->createMock(ModelService::class);
        $modelServiceMock->expects($this->once())->method('getRelation')->willReturn($relation);

        $dataTableFilterService->modelService = $modelServiceMock;

        $this->assertNull($dataTableFilterService->getParentRelationKey($filters));

        $relation = new Relation(Relation::HAS_MANY, User::class, 'field', []);

        $modelServiceMock = $this->createMock(ModelService::class);
        $modelServiceMock->expects($this->once())->method('getRelation')->willReturn($relation);

        $dataTableFilterService->modelService = $modelServiceMock;

        $this->assertNull($dataTableFilterService->getParentRelationKey($filters));

        $relation = new Relation(Relation::HAS_MANY, User::class, 'field', 'fieldRef');

        $modelServiceMock = $this->createMock(ModelService::class);
        $modelServiceMock->expects($this->once())->method('getRelation')->willReturn($relation);

        $dataTableFilterService->modelService = $modelServiceMock;

        $this->assertEquals('fieldRef', $dataTableFilterService->getParentRelationKey($filters));
    }

    public function testHasParent()
    {
        $dataTableFilterService = new DataTableFilterService();
        $filters                = new DataTableFilters();

        $this->assertFalse($dataTableFilterService->hasParent($filters));

        $dataTableFilterServiceMock = $this->getMock(['getParentRelationKey']);

        $dataTableFilterServiceMock->method('getParentRelationKey')->willReturn(true);

        $this->assertTrue($dataTableFilterServiceMock->hasParent($filters));
    }

    /**
     * @param array $methods
     * @return MockObject|DataTableFilterService
     */
    private function getMock(array $methods): MockObject
    {
        return $this->getMockBuilder(DataTableFilterService::class)
            ->setMethods($methods)
            ->getMock();
    }
}