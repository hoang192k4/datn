<?php

namespace App\Traits;

trait SlugHelper
{
    public static function bootSlugHelper()
    {
        static::creating(function ($model) {
            $model->generateSlugIfNeeded();
        });

        static::updating(function ($model) {
            $model->updateSlugIfNeeded();
        });
    }

    protected function generateSlugIfNeeded()
    {
        $slugField = $this->getSlugField();
        $sourceField = $this->getSlugSourceField();

        if (empty($this->$slugField) && !empty($this->$sourceField)) {
            $slug = generate_slug($this->$sourceField);
            $this->$slugField = $this->makeUniqueSlug($slugField, $slug);
        }
    }

    protected function updateSlugIfNeeded()
    {
        $slugField = $this->getSlugField();
        $sourceField = $this->getSlugSourceField();
        $autoUpdate = property_exists($this, 'autoUpdateSlug') ? $this->autoUpdateSlug : true;

        if ($autoUpdate && $this->isDirty($sourceField)) {
            $slug = generate_slug($this->$sourceField);
            $this->$slugField = $this->makeUniqueSlug($slugField, $slug, $this->id);
        }
    }

    protected function makeUniqueSlug($field, $slug, $ignoreId = null)
    {
        $original = $slug;
        $i = 1;

        while (static::where($field, $slug)
            ->when($ignoreId, fn($query) => $query->where('id', '!=', $ignoreId))
            ->exists()
        ) {
            $slug = $original . '-' . $i++;
        }

        return $slug;
    }

    protected function getSlugField()
    {
        return property_exists($this, 'slugField') ? $this->slugField : 'slug';
    }

    protected function getSlugSourceField()
    {
        return property_exists($this, 'slugFrom') ? $this->slugFrom : 'name';
    }
}
