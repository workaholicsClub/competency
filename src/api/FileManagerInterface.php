<?php
namespace Competencies;

interface FileManagerInterface
{
    public function saveData($fileName, $data);
    public function loadData($fileName);
}