<?php
namespace Competencies\File;

use Competencies\FileManagerInterface;


class PhpConfigFileManager implements FileManagerInterface
{
    /**
     * @param string $fileName
     * @param array $data
     * @return bool
     */
    public function saveData($fileName, $data) {
        $stringData = var_export($data, true);
        file_put_contents($fileName,"<?php\nreturn {$stringData};");
        return true;
    }

    /**
     * @param string $fileName
     * @return array
     */
    public function loadData($fileName) {
        return require($fileName);
    }
}